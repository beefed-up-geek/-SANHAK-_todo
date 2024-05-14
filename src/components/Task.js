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
  flex: 4;
  font-size: 18px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
  margin-left: 10px;
`;

const DateContainer = styled.Text`
  flex: 2;
  font-size: 18px; 
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) => (completed ? 'line-through' : 'none')};
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
  const [open, setOpen] = useState(false) //날짜 설정 창을 키고 끄는 변수
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
    //그냥 datePicker창이 뜨도록 변경함
  };
    //날짜를 텍스트로 바꿔주는 함수
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1 필요
      const day = date.getDate();
    
      // 월과 일이 10보다 작을 경우 앞에 0을 붙여줍니다.
      return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
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
        <DateContainer completed={item.completed}>{formatDate(item.date)}</DateContainer>
        <TextContainer completed={item.completed} style={{ color: '#778bdd' }}>{item.text}</TextContainer>
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
            onPressOut={() => setOpen(true)}
          />
        )}
        <IconButton
          type={images.delete}
          id={item.id}
          onPressOut={deleteTask}
          completed={item.completed}
        />
      </BottomContainer>
      <>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
          const editedTask = {...item, date: date};
          updateTask(editedTask);
        }}
        onCancel={() => {
          setOpen(false)
        }
      }
      />
    </>
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

