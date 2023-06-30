import React from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: RGB(100, 35, 165);
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: RGB(100, 35, 165);
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
  const navigate = useNavigate();

  function goToCreate() {
    navigate(`server`);
  }

  return (
    <NavbarContainer>
      <Title><Link style={{textDecoration: 'none'}} to={`/`}>scaleway-test</Link></Title>
      <AddButton onClick={goToCreate}>
        <AddIcon />
        Ajouter
      </AddButton>
    </NavbarContainer>
  );
};

export default Navbar;