import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/documentList.css";

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const [newDocName, setNewDocName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/documents")
            .then((res) => setDocuments(res.data))
            .catch((err) => console.error(err));
    }, []);

    const createDocument = () => {
        if (!newDocName.trim()) return;
        axios.post("http://localhost:5000/documents", { name: newDocName })
            .then((res) => {
                setDocuments([...documents, res.data]);
                setNewDocName("");
            })
            .catch((err) => console.error(err));
    };

    const openDocument = (id) => {
        navigate(`/documents/${id}`);
    };

    return (
        <div className="document-list-container">
            <h1>📄 Collaborative Document Editor</h1>

            <div className="new-doc-form">
                <input
                    type="text"
                    placeholder="Enter new document name"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                />
                <button onClick={createDocument}>Create</button>
            </div>

            <ul className="document-list">
                {documents.map((doc) => (
                    <li key={doc._id}>
                        <span>{doc.name}</span>
                        <button onClick={() => openDocument(doc._id)}>Open</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
