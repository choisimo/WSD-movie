import React, { useState, useEffect } from 'react';
import style from './localStorageManager.module.css';
import { useAlert } from "content/components/alert/customAlert";
import { useTheme } from "content/components/context/themeContext";

const LocalStorageManager = () => {
    const [storageData, setStorageData] = useState({});
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [changedItems, setChangedItems] = useState([]);
    const {theme, toggleTheme} = useTheme();
    const { showAlert } = useAlert();

    // localStorage 데이터를 불러오는 함수
    const loadStorageData = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        setStorageData(data);
    };

    useEffect(() => {
        loadStorageData();
    }, []);

    const handleAdd = () => {
        if (newKey && newValue) {
            localStorage.setItem(newKey, newValue);
            setChangedItems((prev) => [...prev, { key: newKey, value: newValue }]);
            loadStorageData();
            setNewKey('');
            setNewValue('');
        }
    };

    const handleDelete = (key) => {
        localStorage.removeItem(key);
        setChangedItems((prev) => [...prev, { key, value: null }]);
        loadStorageData();
    };

    const handleEdit = (key, value) => {
        localStorage.setItem(key, value);
        setChangedItems((prev) => [...prev, { key, value }]);
        loadStorageData();
    };

    const handleClear = () => {
        localStorage.clear();
        setChangedItems(Object.entries(storageData).map(([key]) => ({ key, value: null })));
        loadStorageData();
    };

    const handleSave = () => {
        if (changedItems.length === 0) {
            showAlert('No changes to save.');
            return;
        }

        const confirmMessage = changedItems
            .map((item) =>
                item.value === null ? `Deleted: ${item.key}` : `Updated: ${item.key} = ${item.value}`
            )
            .join('\n');

        if (window.confirm(`Confirm the following changes:\n${confirmMessage}`)) {
            showAlert('Data saved successfully', 'success');
            setChangedItems([]);
        } else {
            showAlert('Save cancelled', 'error');
        }
    };


    return (
        <div className={style.container}>
            <h1 className={style.header}>LocalStorage Manager</h1>
            <div className={style.inputGroup}>
                <input
                    type="text"
                    placeholder="Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className={style.input}
                />
                <input
                    type="text"
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className={style.input}
                />
                <button onClick={handleAdd} className={style.button}>
                    Add
                </button>
            </div>
            <table className={style.table}>
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(storageData).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>
                            <input
                                type="text"
                                defaultValue={value}
                                onBlur={(e) => handleEdit(key, e.target.value)}
                                className={style.input}
                            />
                        </td>
                        <td>
                            <button
                                onClick={() => handleDelete(key)}
                                className={style.button}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handleSave} className={style.saveButton}>
                Save
            </button>
            <button onClick={handleClear} className={style.clearButton}>
                Clear All
            </button>
        </div>
    );
};

export default LocalStorageManager;
