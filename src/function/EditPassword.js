// 비밀번호 복잡도 함수 정의 - 9 ~ 16자리
export const checkPwd = (pwd, pw) => {
  const userPw = pwd;
  // 대/소문자 + 숫자
  const enNum = /^(?=.*[a-zA-Z])(?=.*[0-9]).{9,16}$/.test(userPw);
  // 대/소문자 + 특수문자
  const enChar = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{9,16}$/.test(userPw);
  // 특수문자 + 숫자
  const numChar = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{9,16}$/.test(userPw);

  if (enNum || enChar || numChar) {
    pw.text = "사용 가능 합니다.";
    pw.color = "success";
    pw.status = true;
  } else {
    pw.text = "9~16자의 영문 대/소문자, 숫자, 특수문자를 사용하세요.";
    pw.color = "danger";
    pw.status = false;
  }
};

// 비밀번호 확인 함수 정의
export const confirmPwd = (pwd, checkPwd, confirmPw) => {
  const userpwd = pwd;
  const userPwdCheck = checkPwd;

  if (userpwd === userPwdCheck && userPwdCheck !== "") {
    confirmPw.text = "비밀번호가 일치합니다.";
    confirmPw.color = "success";
    confirmPw.status = true;
  } else {
    confirmPw.text = "비밀번호가 일치하지 않습니다.";
    confirmPw.color = "danger";
    confirmPw.status = false;
  }
};
