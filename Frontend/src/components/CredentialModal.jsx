import { useState } from "react";
import Modal from "react-modal";

const CredentialModal = ({ isOpen, onRequestClose, onVerify }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(email, password);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Credential Verification"
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto z-50 focus:outline-none"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-40"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Verify Credentials</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            autoFocus
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            disabled={!email || !password}
          >
            Verify
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CredentialModal;
