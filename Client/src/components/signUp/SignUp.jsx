/* eslint-disable no-irregular-whitespace */
import { useState } from "react";
import axios from "axios";
import styles from "./SignUp.module.css";

function SignUp() {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		image: "",
	});
	const [res, setRes] = useState("");
	const [error, setError] = useState({
		name: "",
		email: "",
		password: "",
		image: "",
	});

	const handleChange = (e) => {
		setData({ ...data, [e.target.id]: e.target.value });
		if (error.name && e.target.id == "name") setError({ ...error, name: "" });
		if (error.email && e.target.id == "email")
			setError({ ...error, email: "" });
		if (error.password && e.target.id == "password")
			setError({ ...error, password: "" });
		if (error.image && e.target.id == "image")
			setError({ ...error, image: "" });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// ############### VALIDACIONES ###############
		let err = false;
		let errores = {
			name: "",
			email: "",
			password: "",
			image: "",
		};
		// NAME
		if (data.name.length < 3) {
			errores.name = "× Name must be at least 3 characters long ×";
			err = true;
		}
		// ############## EMAIL
		if (data.email.length < 3) {
			errores.email = "× Email must be at least 3 characters long ×";
			err = true;
		} else if (!data.email.includes("@")) {
			errores.email = "× Email must be valid ×";
			err = true;
		}
		// ################# PASSWORD
		if (data.password.length < 3) {
			errores.password = "× Password must be at least 3 characters long ×";
			err = true;
		} else if (!data.password.match(/[0-9]/g)) {
			errores.password = "× Password must contain at least 1 number ×";
			err = true;
		} else if (!data.password.match(/[A-Z]/g)) {
			errores.password =
				"× Password must contain at least 1 uppercase letter ×";
			err = true;
		}
		// ################# IMAGE
		if (data.image != "" && !data.image.includes("http")) {
			errores.image = "× Image must be a valid URL ×";
			err = true;
		}

		setError({ ...errores });
		console.log(error);
		if (err) return;
		// ############### FIN DE VALIDACIONES ###############

		axios
			.post("http://localhost:3000/user/", data)
			.then((res) => {
				if (res.statusText == "Created") {
					setRes("User created successfully!");
					setData({
						name: "",
						email: "",
						password: "",
						image: "",
					});
				}
				console.log(res);
				console.log(res.statusText);
			})
			.catch((err) => {
				console.log(err);
				if (err.response.data.message.includes("email"))
					setRes("Email already in use");
				else setRes("Error creating user");
			});
	};

	return (
		<div className={styles.container}>
			<h1>SignUp</h1>
			<h2
				onClick={() => setRes("")}
				style={{
					cursor: "pointer",
					color: res.slice(0, 1) === "U" ? "green" : "red",
				}}>
				{res ? <>&times; {res} &times;</> : null} 
			</h2>
			<form
				onSubmit={handleSubmit}
				className={styles.form}>
				<div className={styles.input__group}>
					<label
						htmlFor="name"
						className={styles.label}>
						Name <label style={{ color: "red" }}>*</label>
					</label>
					<input
						type="text"
						id="name"
						value={data.name}
						onChange={handleChange}
						className={`${styles.input} ${
							error.name ? styles["input-error"] : ""
						}`}
					/>
					<span className={styles.tooltiptext}>At least 3 charcaters</span>
					{error.name ? (
						<span
							onClick={() => setError({ ...error, name: "" })}
							className={styles.tooltip}>
							{error.name}
						</span>
					) : null}
				</div>
                <div className={styles.input__group}>
				<label
					htmlFor="email"
					className={styles.label}>
					Email <label style={{ color: "red" }}>*</label>
				</label>
				<input
					type="email"
					id="email"
					value={data.email}
					onChange={handleChange}
					className={`${styles.input} ${
						error.email ? styles["input-error"] : ""
					}`}
				/>
                <span className={styles.tooltiptext}>It should be a valid email</span>
				{error.email ? (
					<span
						onClick={() => setError({ ...error, email: "" })}
						className={styles.tooltip}>
						{error.email}
					</span>
				) : null}
                </div>
                <div className={styles.input__group}>
				<label
					htmlFor="password"
					className={styles.label}>
					Password <label style={{ color: "red" }}>*</label>
				</label>
				<input
					type="password"
					id="password"
					value={data.password}
					onChange={handleChange}
					className={`${styles.input} ${
						error.password ? styles["input-error"] : ""
					}`}
				/>
                <span className={styles.tooltiptext}>At least 3 characters, 1 uppercase and 1 number</span>
				{error.password ? (
					<span
						onClick={() => setError({ ...error, password: "" })}
						className={styles.tooltip}>
						{error.password}
					</span>
				) : null}
                </div>
                <div className={styles.input__group}>
				<label
					htmlFor="image"
					className={styles.label}>
					Image
				</label>
				<input
					type="text"
					id="image"
					onChange={handleChange}
					className={`${styles.input} ${
						error.image ? styles["input-error"] : ""
					}`}
				/>
                <span className={styles.tooltiptext}>It should be an url</span>
				{error.image ? (
					<span
						onClick={() => setError({ ...error, image: "" })}
						className={styles.tooltip}>
						{error.image}
					</span>
				) : null}
                </div>
				<button
					type="submit"
					className={styles.submit}>
					Submit
				</button>
				<label style={{ marginBottom: "10px" }}>
					<label style={{ color: "red" }}>*</label> required
				</label>
			</form>
		</div>
	);
}

export default SignUp;
