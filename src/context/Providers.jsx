import { AuthContextProvider } from "./AuthContext";
import { StockProvider } from "./StockContext";

// eslint-disable-next-line react/prop-types
export function Providers({ children }) {
	return (
		<AuthContextProvider>
			<StockProvider>{children}</StockProvider>
		</AuthContextProvider>
	);
}
