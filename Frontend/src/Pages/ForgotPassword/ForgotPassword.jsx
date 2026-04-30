// src/components/Pages/ForgotPassword/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './forgotPassword.module.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulate API call to request password reset
            const response = await fetch('https://reqres.in/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset link');
            }

            // Simulate success
            setMessage('Password reset link sent to your email.');
            console.log('Reset link sent:', data);

            // Redirect to login page after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordContainer}>
            <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
                <h2>Forgot Password</h2>
                {message && <p className={styles.successMessage}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className={styles.backToLogin}>
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;