import React, {useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {theme} from './theme';
import { StatusBar, Dimensions } from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import DatePicker from 'react-native-date-picker'; // DatePicker 컴포넌트 임포트

//const Container = styled.SafeAreaViewView
const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=>theme.background};
    align-items: center;
    justify-contents: flex-start;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: 600;
    color: ${({theme})=>theme.main};
    align-self: flex-start;
    margin: 0px 20px;
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
  
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

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
  //
  const _onBlur = () => {
    //setNewTask('');
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
            <List width = {width}>
            {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              />
            ))} 
            </List>
            <DatePicker
        modal
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