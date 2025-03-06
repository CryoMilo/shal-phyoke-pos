/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [session, setSession] = useState(undefined);

	const getUserSession = async () => {
		const { data, error } = await supabase.auth.getSession();

		if (error) {
			console.error("There was an error getting user session", error);
			return { success: false, error };
		}

		console.log("CURRENT SESSION", data.session?.user);

		return data.session;
	};

	useEffect(() => {
		const fetchSession = async () => {
			const currentSession = await getUserSession(); // Await the result
			setSession(currentSession || undefined);
		};

		fetchSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	const signUpNewUser = async ({ email, password }) => {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error("There was an error signing up", error);
			return { success: false, error };
		}

		if (data) {
			alert("Sign Up Success!");
			return { success: true, data };
		}
	};

	const logInUser = async ({ email, password }) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.error("There was an error logging in", error);
				return { success: false, error };
			}

			if (data) {
				alert("Log In Success!");
				return { success: true, data };
			}
		} catch (error) {
			console.error("There was an error Logging in", error);
		}
	};

	const signOutUser = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("There was an error signing up", error);
			return { success: true, error };
		}
	};

	return (
		<AuthContext.Provider
			value={{ session, signUpNewUser, signOutUser, logInUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
