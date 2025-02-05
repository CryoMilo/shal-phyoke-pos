export const getMenuPriceTotal = (menu) => {
	return menu.reduce(
		(total, item) =>
			total +
			(item.price ?? 0) * (item.quantity + (item.takeawayQuantity ?? 0)),
		0
	);
};
