import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function App() {
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		getCountries();
	}, []);

	async function getCountries() {
		const { data } = await supabase.from("menu_item").select();
		setCountries(data);
	}

	return (
		<div>
			Waassup
			<ul>
				{countries.map((country) => (
					<li key={country.name}>{country.name}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
