import React from 'react';

/**
 * ComponentIndex - Central export for all components
 * Makes it easy to import: import { Button, Card, Modal } from './components'
 */

export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as FormInput } from './FormInput';
export { default as Modal } from './Modal';
export { default as Table } from './Table';
export { default as Alert } from './Alert';
export { default as LoadingSpinner } from './LoadingSpinner';

/**
 * USAGE EXAMPLES:
 * 
 * import { Button, Card, FormInput } from '../components';
 * 
 * // Button
 * <Button variant="primary" size="lg">Click me</Button>
 * 
 * // Card
 * <Card title="My Card">Content here</Card>
 * 
 * // FormInput
 * <FormInput
 *   label="Name"
 *   name="name"
 *   value={name}
 *   onChange={handleChange}
 *   placeholder="Enter name"
 * />
 * 
 * // Modal
 * <Modal
 *   isOpen={showModal}
 *   title="Confirm"
 *   onClose={() => setShowModal(false)}
 * >
 *   Are you sure?
 * </Modal>
 * 
 * // Table
 * <Table
 *   columns={[
 *     { header: 'Name', key: 'name' },
 *     { header: 'Email', key: 'email' }
 *   ]}
 *   data={users}
 *   onRowClick={(row) => console.log(row)}
 * />
 * 
 * // Alert
 * <Alert
 *   type="success"
 *   title="Success!"
 *   message="Operation completed"
 * />
 * 
 * // LoadingSpinner
 * <LoadingSpinner size="lg" message="Loading data..." />
 */
