import React,{useState} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';
import Input from './Input';
import DatePicker from 'react-native-date-picker'
//UI 배치 컴포넌트--------------------------------------------------------------------------------------------------
// 전체 컨테이너
const Container = styled.View`
  flex-direction: column;
  align-items: stretch;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

// 첫 번째 서브 컨테이너
const TopContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

// 각 요소 스타일
const CheckBoxContainer = styled.View`
  flex: 1;
  margin-left: auto;
`;

const TextContainer = styled.Text`
  flex: 2;
  font-size: 18px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
  margin-left: 10px;
`;

const DateContainer = styled.Text`
  flex: 1;
  font-size: 18px; 
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
  margin-left: 10px;
`;

// 두 번째 서브 컨테이너
const BottomContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
`;
const Contents = styled.Text`
  flex: 1;
  font-size: 20px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'}; 
`;//color는 completed의 done의 색상이 되고, text-decoration은 completed의 경우 가로선이 그어지도록 설정됨
//UI 배치 컴포넌트--------------------------------------------------------------------------------------------------


//item은 할일, deletetask는 삭제함수, toggletask는 완료 함수, updateTask는 수정함수 
const Task = ({ item, deleteTask, toggleTask, updateTask}) => {
  const [isEditing, setIsEditing] = useState(false); //현재 수정중인지 아닌지 상태
  const [text, setText] = useState(item.text); //텍스트 설정
  const [date, setDate] = useState(item.date); //@날짜 설정
  //연필 버튼이 클릭되면 isEditing을 true로 만듦
  const _handleUpdateButtonPress = () => {
    setIsEditing(true);
  };
  //수정 완료시에 isEditing을 다시 false로 바꾸고 text를 새로 object에 등록하고 task도 새로운 object로 바꿈
  const _onSubmitEditing = () => {
    if (isEditing) {
      const editedTask = Object.assign({}, item, { text });
      setIsEditing(false);
      updateTask(editedTask);
    }
  };
  //수정중에 input 컴포넌트가 focus잃으면 수정 취소
  const _onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(item.text);
    }
  };
  // 날짜 변경 버튼을 눌렀을 때의 처리 함수
  const _handleDateChangeButtonPress = () => {
    // item 오브젝트를 복사하고, date 속성을 "5/13"으로 업데이트
    const editedTask = {...item, date: '5/13'};
    // 수정된 task 객체로 업데이트 함수를 호출
    updateTask(editedTask);
  };

  //만약 isEditing중이라면 Input텍스트 상자로 치환함
  return isEditing ? (
    <Input
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={_onSubmitEditing}
      onBlur={_onBlur}
    />
  ) : (
    <Container>
      <TopContainer>
        <CheckBoxContainer>
          <IconButton 
            type={item.completed ? images.completed : images.uncompleted}
            id={item.id}
            onPressOut={toggleTask}
            completed={item.completed}
          />
        </CheckBoxContainer>
        <DateContainer completed={item.completed}>{item.date}</DateContainer>
        <TextContainer completed={item.completed}>{item.text}</TextContainer>
      </TopContainer>
      <BottomContainer>
        {item.completed || (
          <IconButton
            type={images.update}
            onPressOut={_handleUpdateButtonPress}
          />
        )}
        {item.completed || (
          <IconButton
            type={images.calander}
            onPressOut={_handleDateChangeButtonPress}
          />
        )}
        <IconButton
          type={images.delete}
          id={item.id}
          onPressOut={deleteTask}
          completed={item.completed}
        />
      </BottomContainer>
    </Container>
  );
};

Task.propTypes = {
  item: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Task;

