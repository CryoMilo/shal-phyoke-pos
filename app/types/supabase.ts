// TypeScript types for the database schema

// Type representing a table in the restaurant
export type Table = {
	table_id: number; // Unique identifier for the table
	table_name: string; // Name or label for the table
	occupied: boolean; // Indicates if the table is occupied
};

// Type representing a menu item
export type MenuItem = {
	menu_id: number; // Unique identifier for the menu item
	menu_name: string; // Name of the menu item
	price: number; // Price of the menu item
	description?: string; // Description of the menu item (optional)
	is_vegan: boolean; // Indicates if the item is vegan
	taste?: string; // Flavor profile or taste description (optional)
};

// Type representing an order
export type Order = {
	order_id: number; // Unique identifier for the order
	table_id: number; // ID of the associated table
	menu_id: number; // ID of the associated menu item
	order_time: string; // Timestamp when the order was created
	status: 1 | 2; // Order status: 1 = completed, 2 = making
	paid: boolean; // Indicates if the order is paid
	payment_method: "cash" | "QR"; // Payment method for the order
};
