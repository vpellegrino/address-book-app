import {
	Button,
	Modal,
	ModalBox,
	ModalBoxBody,
	ModalBoxFooter,
	ModalVariant,
} from '@patternfly/react-core';
import React from 'react';

import User from '@models/User';

interface UserModalProps {
  selectedUser: User;
  onClose: () => void;
}

export default function UserModal({
	selectedUser,
	onClose,
}: UserModalProps): JSX.Element {
	const userLocation = `${selectedUser.location.city}, ${selectedUser.location.state} (${selectedUser.location.country})`;

	return (
		<Modal
			variant={ModalVariant.medium}
			title={`${selectedUser.name.first} ${selectedUser.name.last}`}
			isOpen={!!selectedUser}
			onClose={onClose}
		>
			<ModalBox aria-describedby="User Info Modal">
				<ModalBoxBody>
					<p>Username: {selectedUser.login.username}</p>
					<p>Email: {selectedUser.email}</p>
					<p>Gender: {selectedUser.gender}</p>
					<p>Location: {userLocation}</p>
					<p>Phone: {selectedUser.cell ?? selectedUser.phone}</p>
				</ModalBoxBody>
				<ModalBoxFooter>
					<Button onClick={onClose}>Close</Button>
				</ModalBoxFooter>
			</ModalBox>
		</Modal>
	);
}
