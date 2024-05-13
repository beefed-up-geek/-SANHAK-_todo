import React, {useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {theme} from './theme';
import { StatusBar, Dimensions,TextInput, TouchableOpacity, Text } from 'react-native';
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
const AddButton = styled.TouchableOpacity`
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

//task가 들어갈 List 뷰 선언
const List = styled.ScrollView`
  flex:1;
  width: ${({width})=>width-40}px
`;

export default function App() {
  //창의 너비를 width에 저장함
  const width=Dimensions.get('window').width;
  //newTask는 기본이 ' '이고, setNewTask(텍스트)로 바꿀 수 있다
  const [newTask, setNewTask] = useState('');
  //tasks 컴포넌트 만들기
  const [tasks, setTasks] = useState({
    '1':{id:'1', text: '산학 리액트 과제',date: new Date(2024, 0, 1), completed: false},
    '2':{id:'2', text: 'kick-off 미팅',date: new Date(2024, 0, 1), completed: false},
    '3':{id:'3', text: '시스템프로그램 퀴즈',date: new Date(2024, 0, 1), completed: false}
  }); 
   //날짜 등록용 변수
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

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
  const showDefaultTasks = () => {
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
  
  const _onBlur = () => {
    //setNewTask(''); 자꾸 에러 내서 개빡친다
  };
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
              onBlur={_onBlur}
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
            <AddButton onPress={() => {}}>
              <Text style={{ color: '#FFFFFF' }}>AI</Text>
            </AddButton>

            <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={(date) => {
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