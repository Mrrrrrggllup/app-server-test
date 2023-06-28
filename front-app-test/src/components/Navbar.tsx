import React from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  svg {
    margin-right: 6px;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Title>scaleway-test</Title>
      <AddButton>
        <AddIcon />
        Ajouter
      </AddButton>
    </NavbarContainer>
  );
};

export default Navbar;