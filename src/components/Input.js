import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
  width: ${({ width }) => width - 40}px;
  height: 60px;
  margin: 3px 0;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 25px;
  color: ${({ theme }) => theme.text};
`;

const Input = ({
  placeholder, //default로 떠있는 텍스트
  value, // 할일 텍스트
  onChangeText, //텍스트 변화를 처리하는 함수
  onSubmitEditing, //입력 완료를 터리하는 함수
  onBlur, //입력 도중에 input영역이 focus잃으면 수정 취소
}) => {
  //너비를 창의 너비와 맞춘다
  const width = Dimensions.get('window').width;
  // const width = useWindowDimensions().width;

  return (
    <StyledInput //매개변수로 받은 함수와 변수를 각각 styledinput의 prop으로 전달
      width={width}
      placeholder={placeholder}
      maxLength={50}
      autoCapitalize="none" //자동 대문자 끔
      autoCorrect={false} //자동 수정 끔
      returnKeyType="done"
      keyboardAppearance="dark" // iOS only
      value={value} 
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
    />
  );
};

//input의 매개변수의 형태를 지정
Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Input;
