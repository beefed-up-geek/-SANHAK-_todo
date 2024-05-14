import {app, db, analytics, getFirestore, collection, addDoc, getDocs} from '../firebase/index'
import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {theme} from './theme';
import IconButton from './components/IconButton';
import { images } from './images';
import { StatusBar, Dimensions,TextInput, TouchableOpacity, Text , Image} from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import DatePicker from 'react-native-date-picker'; // DatePicker 컴포넌트 임포트

// 8081 포트번호가 9256
//에러 발생시 taskkill /f /pid 9256
//const Container = styled.SafeAreaViewView
const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=>theme.background};
    align-items: center;
    justify-contents: flex-start;
    position: relative;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: 600;
    color: ${({theme})=>theme.main};
    align-self: flex-start;
    margin: 0px 20px;
`;
//인공지능 버튼 
const AIButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.main};
  border-radius: 30px;
`;
//인공지능 텍스트창
const AIInput = styled.TextInput`
  position: absolute;
  left: 90px; 
  bottom: 20px;
  width: 280px; 
  height: 60px; 
  padding: 10px;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.main};
  display: ${({ visible }) => visible ? 'flex' : 'none'};
`;
//인공지능 텍스트 보내기 창
const SendButton = styled.TouchableOpacity`
  position: absolute;
  left: 310px; 
  bottom: 20px;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.secondary}; 
  border-radius: 30px;
  display: ${({ visible }) => visible ? 'flex' : 'none'};
`;
//task가 들어갈 List 뷰 선언
const List = styled.ScrollView`
  flex:1;
  width: ${({width})=>width-40}px
`;

export default function App() {
  //AI검색창 영역======================================================================
  //AI검색창 보이고 안보이게하기
  const [inputVisible, setInputVisible] = useState(false);
  //AI검색창 껐다가 키기
  const toggleInput = () => {
    setInputVisible(!inputVisible);
    showAllTasks();
  };
  //=================================================================================
  //창의 너비를 width에 저장함
  const width=Dimensions.get('window').width;
  //newTask는 기본이 ' '이고, setNewTask(텍스트)로 바꿀 수 있다
  const [newTask, setNewTask] = useState('');
  //tasks 컴포넌트 만들기
  const [tasks, setTasks] = useState({
    '1':{id:'1', text: '할일 1',date: new Date(2024, 4, 14), completed: false},
    '2':{id:'2', text: '할일 2',date: new Date(2024, 4, 15), completed: false},
    '3':{id:'3', text: '할일 3',date: new Date(2024, 4, 16), completed: false},
    '4':{id:'4', text: '할일 4',date: new Date(2024, 4, 17), completed: false},
    '5':{id:'5', text: '할일 5',date: new Date(2024, 4, 18), completed: false},
  }); 
   //날짜 등록용 변수
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  //인공지능 검색 텍스트와 변수들
  const [AImessage, setAImessage] = useState('');
  const [responseText, setResponseText] = useState('');
  const MY_CHATGPT_API_KEY = 'sk-proj-7MAehGcOgZsj2V1yJGstT3BlbkFJNHefFcuqQte2Pe7dbuDV';
  //인공지능을 호출하는 함수
  const handleSendRequest = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MY_CHATGPT_API_KEY}`
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {
              "role": "system",
              "content": `you are a helpful assistant that manages to-do application.
              You will sort, delete add, manipulate tasks. followings are some examples. 

              [user] 2024년5월14일날 할일만 보여줘
              [assistant] searchDateTasks 2024-05-14

              [user] 2024년4월 20일날 할일만 보여줘
              [assistant] searchDateTasks 2024-04-20

              [user] 2024년12월 25일날 할일만 보여줘
              [assistant] searchDateTasks 2024-12-25

              [user] 오늘 해야할 일을 보여줘
              [assistant] searchDateToday

              [user] 오늘은 어떤걸 해야하지?
              [assistant] searchDateToday
              `
            },
            {
              "role": "user",
              "content": AImessage
            }
          ],
          "temperature": 0,
        }),
      });
      const jsonResponse = await response.json();

      // Log the response for debugging
      console.log('Response:', jsonResponse);
      const responseText = jsonResponse.choices[0].message.content;
      console.log('Parsed response:', responseText);

      // Check if the response commands to search tasks for today
      if (responseText === "searchDateToday") {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // Convert today's date to YYYY-MM-DD format
        searchDateTasks(dateStr); // Call the searchDateTasks function with today's date
      } else if (responseText.startsWith("searchDateTasks")) {
        const dateStr = responseText.split(' ')[1]; // Split and get the date part
        searchDateTasks(dateStr); // Call the searchDateTasks function with the date
      } else {
        setResponseText(responseText); // Set the response text as usual if not a command
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setAImessage(''); // Clear the AI message input field
};


  //검색 함수들=====================================================================
  //날짜 검색용 변수
  const [searchDate, setSearchDate] = useState('');
  //날짜 검색 배열
  const [filteredTasks, setFilteredTasks] = useState([]);
  //날짜에 맞는 task를 검색하는 함수
  const searchDateTasks = (searchDate) => {
    const dateToSearch = new Date(searchDate);
    const results = Object.values(tasks).filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === dateToSearch.toDateString();
    });
    setFilteredTasks(results);
  };
  //다시 원상태로 되돌리는 함수
  const showAllTasks = () => {
    setFilteredTasks([]); // 비워서 전체 리스트를 다시 보여줍니다.
  };
  
  //텍스트 변화를 처리하는 함수
  const _handleTextChange = text => {
    setNewTask(text);
  };
  //할일 추가하는 함수 
  const _addTask = () => {
    setOpen(true)
};
  //삭제 기능 구현
  const _deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    setTasks(currentTasks);
  };
  //할일 완료 기능
  const _toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    setTasks(currentTasks);
  };
  //할일 수정 기능
  const _updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    setTasks(currentTasks);
  };
  const forceUpdate = useState()[1].bind(null, {}); // 강제 업데이트 함수
  
  
    return (
      <ThemeProvider theme={theme}>
        <Container>
            <StatusBar
            barStyle="light-content"
            backgroundColor={theme.background}
            />
            <Title>SANHAK TODO</Title>
            <Input // ./components/input.js에서 매개변수 확인!!
              placeholder="할 일 추가 +"
              value={newTask} 
              onChangeText={_handleTextChange}
              onSubmitEditing={_addTask}
            />
             <List width={width}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(item => (
              <Task key={item.id} item={item} deleteTask={ _deleteTask} toggleTask={_toggleTask} updateTask={_updateTask}/>
            ))
          ) : (
            Object.values(tasks)
              .reverse()
              .map(item => (
                <Task key={item.id} item={item} deleteTask={ _deleteTask} toggleTask={_toggleTask} updateTask={_updateTask}/>
              )) //({ item, deleteTask, toggleTask, updateTask})
          )}
        </List>
        <AIButton onPress={toggleInput}>
          <Text style={{ color: '#FFFFFF' }}>AI</Text>
        </AIButton>
        <AIInput
          visible={inputVisible}
          placeholder="   무엇이든 물어봐 주세요!"
          value={AImessage}
          onChangeText={text => setAImessage(text)} // Correctly update AImessage
          onSubmitEditing={() => {handleSendRequest()}} // Use a function to handle logging
          placeholderTextColor="#999"
          style={{ color: 'white' }}
        />
        <SendButton visible={inputVisible} onPress={() => {handleSendRequest()}}>
          <Image
            source={images.send}
            style={{ width: 25, height: 25 }} // Customize size as needed
        />
          </SendButton>
        <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={async(date) => {
          setOpen(false);
          setDate(date);
          const currentText = newTask; // 현재 입력된 텍스트를 임시 변수에 저장
          if (currentText.trim() === '') {
            alert('할 일을 입력해 주세요.'); // 입력이 비어있는 경우 경고
            return;
          }
          const ID = Date.now().toString(); // 새로운 task의 고유 ID 생성
          const newTaskObject = {
            [ID]: {
              id: ID,
              text: currentText,
              date: date,
              completed: false
            },
          };
          try {
            const docRef = await addDoc(collection(db, "users"), {
              [ID]: {
                id: ID,
                text: currentText,
                date: date,
                completed: false
              }
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          setTasks({ ...tasks, ...newTaskObject }); // 새로운 task를 기존 task에 추가
          setNewTask(''); // 입력 필드 초기화
        }}
        
        onCancel={() => {
          setOpen(false)
        }}
      />
        </Container>
      </ThemeProvider>
    );
  }