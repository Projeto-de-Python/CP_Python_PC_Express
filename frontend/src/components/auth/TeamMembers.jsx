import { Users, X } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const TeamButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  color: white;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MemberItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    transform: translateX(4px);
  }
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const MemberRM = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const TeamMembers = () => {
  const [isOpen, setIsOpen] = useState(false);

  const teamMembers = [
    { name: 'Lucca Phelipe Masini', rm: 'RM 564121' },
    { name: 'Luiz Henrique Poss', rm: 'RM 562177' },
    { name: 'Luis Fernando de Oliveira Salgado', rm: 'RM 561401' },
    { name: 'Igor Paixão Sarak', rm: 'RM 563726' },
    { name: 'Bernardo Braga Perobeli', rm: 'RM 562468' }
  ];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <TeamButton onClick={openModal} title="Ver integrantes da equipe">
        <Users size={24} />
      </TeamButton>

      {isOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <X size={20} />
            </CloseButton>

            <Title>Big 5 Team</Title>

            <MemberList>
              {teamMembers.map((member, index) => (
                <MemberItem key={index}>
                  <MemberName>{member.name}</MemberName>
                  <MemberRM>{member.rm}</MemberRM>
                </MemberItem>
              ))}
            </MemberList>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

TeamMembers.propTypes = {
  isDark: PropTypes.bool.isRequired
};

export default TeamMembers;
