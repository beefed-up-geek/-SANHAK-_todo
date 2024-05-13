import React,{useState} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';
import Input from './Input';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'}; 
`;//color는 completed의 done의 색상이 되고, text-decoration은 completed의 경우 가로선이 그어지도록 설정됨

//item은 할일, deletetask는 삭제함수, toggletask는 완료 함수, updateTask는 수정함수 
const Task = ({ item, deleteTask, toggleTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false); //현재 수정중인지 아닌지 상태
  const [text, setText] = useState(item.text); //텍스트 설정
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
      <IconButton
        type={item.completed ? images.completed : images.uncompleted}
        id={item.id}
        onPressOut={toggleTask}
        completed={item.completed}
      />
      <Contents completed={item.completed}>{item.text}</Contents>
      {item.completed || (
        <IconButton
          type={images.update}
          onPressOut={_handleUpdateButtonPress}
        />
      )}
      <IconButton
        type={images.delete}
        id={item.id}
        onPressOut={deleteTask}
        completed={item.completed}
      />
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

