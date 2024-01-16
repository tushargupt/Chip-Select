import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './selectBar.css'
import { generateAvatar } from '../Util/getAvtaar';

interface User {
    name: string;
    email: string;
}

interface ChipDropdownProps {
    options: User[];
}

const SelectBar: React.FC<ChipDropdownProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChips, setSelectedChips] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [highlightedChipIndex, setHighlightedChipIndex] = useState<number | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleChipClick = (user: User) => {
        const updatedChips = [...selectedChips, user];
        setSelectedChips(updatedChips);
        setInputValue('');
    };

    const handleRemoveChip = (user: User) => {
        const updatedChips = selectedChips.filter((selectedUser) => selectedUser !== user);
        setSelectedChips(updatedChips);
        setInputValue('');
        setHighlightedChipIndex(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setIsOpen(true);
        setHighlightedChipIndex(null);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const matchingUser = options.find((user) =>
                user.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            if (matchingUser) {
                handleChipClick(matchingUser);
            }
        } else
            if (event.key === 'Backspace' && inputValue === '' && selectedChips.length > 0 && highlightedChipIndex === null) {
                setHighlightedChipIndex(selectedChips.length - 1);
            } else if (event.key === 'Backspace' && inputValue === '' && highlightedChipIndex !== null) {
                handleRemoveChip(selectedChips[highlightedChipIndex]);
            }
    };

    const handleChipKeyDown = (event: KeyboardEvent<HTMLDivElement>, user: User, index: number) => {
        if (event.key === 'Backspace' && inputValue === '' && selectedChips.length > 0 && highlightedChipIndex === null) {
            setHighlightedChipIndex(selectedChips.length - 1);
        } else if (event.key === 'Backspace' && inputValue === '' && highlightedChipIndex !== null) {
            handleRemoveChip(selectedChips[highlightedChipIndex]);
        } else if (event.key === 'ArrowLeft' && index > 0) {
            setHighlightedChipIndex(index - 1);
        } else if (event.key === 'ArrowRight' && index < selectedChips.length - 1) {
            setHighlightedChipIndex(index + 1);
        }
    };

    return (
        <div className="chip-dropdown" ref={dropdownRef}>
            <div className="selected-chips">
                {selectedChips.map((user, index) => (
                    <div
                        key={index}
                        className={`${highlightedChipIndex === index ? 'highlighted' : 'chip-selected'}`}
                        onKeyDown={(event) => handleChipKeyDown(event, user, index)}
                        tabIndex={0}
                    >
                        <img
                            src={generateAvatar(user.name)}
                            className='image-avatar'
                            alt='Avatar'
                        />
                        <div style={{ margin: "0px 5px" }}>{user.name}</div>
                        <button className="chip-remove-icon" onClick={() => handleRemoveChip(user)}
                        >X</button>
                    </div>
                ))}
                <div className='selectbox'>
                    <input
                        type="text"
                        placeholder="Type to search..."
                        value={inputValue}
                        style={{ outline: 'none', border: 0 }}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                    {isOpen && (
                        <div className="dropdown-options">
                            {options
                                .filter((user) => !selectedChips.includes(user))
                                .filter((user) => user.name.toLowerCase().includes(inputValue.toLowerCase()))
                                .map((user, index) => (
                                    <div
                                        key={index}
                                        className="chip"
                                        onClick={() => handleChipClick(user)}
                                    >
                                        <img
                                            src={generateAvatar(user.name)}
                                            className='image-avatar'
                                            alt="Avatar"
                                        />
                                        <div style={{ fontSize: 14, width: '40%', marginLeft: 8 }}>{user.name}</div>
                                        <div style={{ fontSize: 11 }}>{user.email}</div>
                                    </div>
                                ))}
                            {options
                                .filter((user) => !selectedChips.includes(user))
                                .filter((user) => user.name.toLowerCase().includes(inputValue.toLowerCase())).length === 0 && (
                                    <span>No Options</span>
                                )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SelectBar;