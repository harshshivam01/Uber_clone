import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import axios from 'axios';

const OtpVerificationPanel = ({ onVerify, rideId, onClose }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rideId) {
            setError('Invalid ride ID');
            console.error('Missing rideId:', rideId);
            return;
        }

        if (!otp || otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            console.log('Submitting OTP verification:', { rideId, otp });
            
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/ride/verify-otp`,
                {
                    rideId: rideId.toString(),
                    otp: otp.toString()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('OTP verification response:', response.data);

            if (response.data.success) {
                onVerify(response.data.ride);
                onClose?.();
            } else {
                setError(response.data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <Shield className="text-green-600 w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-semibold">Verify OTP</h2>
                    <p className="text-gray-600 text-center mt-2">
                        Ask the passenger for the OTP displayed on their app
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        pattern="\d*"
                        maxLength="4"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setOtp(value);
                            setError(''); // Clear error when user types
                        }}
                        placeholder="Enter 4-digit OTP"
                        className="w-full text-center text-3xl tracking-[0.5em] py-3 border rounded-lg"
                        disabled={loading}
                        autoComplete="off"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 4}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                            loading || otp.length !== 4
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {loading ? 'Verifying...' : 'Verify & Start Ride'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationPanel;