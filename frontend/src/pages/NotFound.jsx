import React from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() { 
  const navigate = useNavigate();
  return (
    <div className="pt-20">
      <EmptyState 
        title="404 - Page Not Found" 
        description="The page you are looking for doesn't exist." 
        action={<Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>}
      />
    </div>
  ); 
}
