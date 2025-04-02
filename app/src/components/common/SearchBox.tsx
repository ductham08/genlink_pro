import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import '../../styles/common/searchBox.scss';
import CreateLinkModal from '../modals/CreateLinkModal';

interface SearchBoxProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
    placeholder = "Tìm kiếm...",
    value,
    onChange,
    className = "search-box"
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={`search-box ${className}`}>
            <Input
                placeholder={placeholder}
                prefix={<SearchOutlined />}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
            >
                Tạo link
            </Button>
            <CreateLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default SearchBox; 