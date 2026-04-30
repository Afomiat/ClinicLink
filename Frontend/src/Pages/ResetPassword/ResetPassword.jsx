// // src/components/Pages/ResetPassword/ResetPassword.jsx
// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import styles from './resetPassword.module.css';

// function ResetPassword() {
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Extract token from the URL query parameters
//     const token = new URLSearchParams(location.search).get('token');

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setLoading(true);
//         setError('');

//         if (newPassword !== confirmPassword) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }

//         try {
//             // Simulate API call to reset password
//             const response = await fetch('https://reqres.in/api/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     token: token,
//                     newPassword: newPassword,
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Failed to reset password');
//             }

//             // Simulate success
//             setMessage('Password reset successful. Redirecting to login...');
//             setTimeout(() => {
//                 navigate('/login');
//             }, 3000); // Redirect after 3 seconds
//         } catch (err) {
//             setError(err.message || 'An error occurred. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={styles.resetPasswordContainer}>
//             <form onSubmit={handleSubmit} className={styles.resetPasswordForm}>
//                 <h2>Reset Password</h2>
//                 {message && <p className={styles.successMessage}>{message}</p>}
//                 {error && <p className={styles.error}>{error}</p>}

//                 <div className={styles.formGroup}>
//                     <label htmlFor="newPassword">New Password</label>
//                     <input
//                         type="password"
//                         id="newPassword"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className={styles.formGroup}>
//                     <label htmlFor="confirmPassword">Confirm Password</label>
//                     <input
//                         type="password"
//                         id="confirmPassword"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <button type="submit" className={styles.submitButton} disabled={loading}>
//                     {loading ? 'Resetting...' : 'Reset Password'}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default ResetPassword;