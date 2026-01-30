import { useState, useEffect } from 'react';
import { login, checkLogin } from '@/api/server/login';
import { useNavigate } from 'react-router';

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 登入表單輸入變更
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [messageSignIn, setMessageSignIn] = useState('');
  const [isErrorSignIn, setIsErrorSignIn] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  // 登入表單提交
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setBtnLoading(true);
      const {
        data: { token, expired },
      } = await login(formData);
      setMessageSignIn('登入成功');
      setIsErrorSignIn(false);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      if (token) {
        document.cookie = `hexschoolToken=${token}; expires=${new Date(expired)};`;
      }
    } catch (error) {
      setIsErrorSignIn(true);
      setMessageSignIn(error.response?.data?.message || '未知錯誤');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                name="username"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit" disabled={btnLoading}>
              {btnLoading && (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              )}
              <span>登入</span>
            </button>
            {messageSignIn && (
              <div className={`alert ${isErrorSignIn ? 'alert-danger' : 'alert-success'} mt-2 mb-0 p-2`} role="alert">
                <div className={`${isErrorSignIn ? 'text-danger' : 'text-success'}`}>{messageSignIn}</div>
              </div>
            )}
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
};
