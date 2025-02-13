import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const OtpVerificationPanel = ({ onVerify }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would verify this OTP with your backend
    if (otp === '1234') { // Mock verification
      onVerify(true);
    } else {
      alert('Invalid OTP');
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP"
            className="w-full text-center text-2xl tracking-widest py-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Verify & Start Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPanel; 