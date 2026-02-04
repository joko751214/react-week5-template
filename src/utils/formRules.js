export const rules = {
  required: (msg = '此欄位必填') => [
    { required: true, message: msg }
  ],
  email: [{ type: 'email', message: '請輸入有效的 Email' }],
}