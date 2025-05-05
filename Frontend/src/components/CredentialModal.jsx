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
      className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-auto mt-40 relative z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-40"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-red-600">Verify Credentials</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 rounded bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white">
            Verify
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CredentialModal;
