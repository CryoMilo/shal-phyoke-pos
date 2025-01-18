import { Link } from "react-router-dom";

const Order = () => {
	return (
		<div>
			<h2>Order</h2>

			<div className="flex flex-col gap-3 my-9">
				<Link to="/order/create" className="text-blue-600">
					Create Order
				</Link>
			</div>
		</div>
	);
};

export default Order;
