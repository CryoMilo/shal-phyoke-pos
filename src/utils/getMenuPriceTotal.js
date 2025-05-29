export const getMenuPriceTotal = (menu) => {
	if (menu.length == 0) {
		return 0;
	}

	return menu.reduce(
		(total, item) =>
			total +
			(item.price ?? 0) * (item.quantity + (item.takeawayQuantity ?? 0)),
		0
	);
};
