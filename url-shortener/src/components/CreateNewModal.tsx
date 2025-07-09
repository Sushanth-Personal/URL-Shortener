// src/components/CreateNewModal.tsx
'use client';
import Modal from './Modal';
import axios from 'axios';

export default function CreateNewModal({ show, onClose, title, modalType }: { show: boolean; onClose: () => void; title: string; modalType: string }) {
    const baseURL =
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission to /api/links
    await axios.post(`${baseURL}/api/url`, { url: 'example.com', remarks: 'test' }, { withCredentials: true });
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="URL" className="w-full"/>
        <input type="text" placeholder="Remarks" className="w-full p-2 border" />
        <button type="submit" className="bg-primary text-white p-2 rounded">Submit</button>
      </form>
    </Modal>
  );
}