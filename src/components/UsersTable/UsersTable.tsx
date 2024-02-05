import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React, { useState } from 'react';

import UserModal from '@components/UserModal';
import User from '@models/User';

import style from './UsersTable.scss';

interface UserTableProps {
  users: User[];
  loading: boolean;
  endOfCatalog: boolean;
}

export default function UsersTable({
	endOfCatalog,
	loading,
	users,
}: UserTableProps): JSX.Element {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	return (
		<>
			<Table aria-label="Users list" isStriped className={style.usersTable}>
				<Thead>
					<Tr>
						<Th>Thumbnail</Th>
						<Th>First Name</Th>
						<Th>Last Name</Th>
						<Th>Username</Th>
						<Th>Email</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users?.map((user) => {
						return (
							<Tr
								key={user.login.uuid}
								isClickable
								onRowClick={() => setSelectedUser(user)}
							>
								<Td>
									<img
										src={user.picture?.thumbnail}
										alt="user picture thumbnail"
										className={style.thumbnailImage}
										loading="lazy"
									/>
								</Td>
								<Td>{user.name.first}</Td>
								<Td>{user.name.last}</Td>
								<Td>{user.login.username}</Td>
								<Td>{user.email}</Td>
							</Tr>
						);
					})}
				</Tbody>
				{loading && (
					<tfoot>
						<Tr>
							<Td colSpan={5} className={style.loadingText}>
                Loading
							</Td>
						</Tr>
					</tfoot>
				)}
				{endOfCatalog && (
					<tfoot>
						<Tr>
							<Td colSpan={5}>End of users catalog</Td>
						</Tr>
					</tfoot>
				)}
			</Table>
			{selectedUser && (
				<UserModal
					selectedUser={selectedUser}
					onClose={() => setSelectedUser(null)}
				/>
			)}
		</>
	);
}
