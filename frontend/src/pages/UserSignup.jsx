import { Link, useNavigate } from "react-router-dom";
import uberLogo from "../assets/uber-logo.svg";
import { useContext, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, setUserData] = useState({});
  const { setUserData } = useContext(UserDataContext);

  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        fullname: {
          firstname: firstname,
          lastname: lastname,
        },

        email: email,
        password: password,
      };

      console.log(`${import.meta.env.VITE_BASE_URL}`);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/register`,
        newUser
      );
      setUserData(response.data.newUser);
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setEmail("");
      setPassword("");
      setFirstname("");
      setLastname("");
    }
  };
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img className="w-24 mb-2" src={uberLogo}></img>
        <form
          onSubmit={(e) => {
            submithandler(e);
          }}
        >
          <h3 className="text-xl font-medium mb-2">What's your name</h3>
          <div className="flex items-center justify-between gap-3">
            <input
              className="border bg-[#eeeeee] px-4 py-2 rounded-md w-1/2 text-lg placeholder:text-base mb-5  "
              required
              autoComplete="off"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <input
              className="border bg-[#eeeeee] px-4 py-2 rounded-md w-1/2 text-lg placeholder:text-base mb-5  "
              required
              autoComplete="off"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">What's your email</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-5  "
            required
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-xl font-medium mb-2">Enter password</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-5"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          <button
            className="bg-[#111] text-white font-semibold px-4 py-2 rounded-md w-full  mb-2"
            type="submit"
          >
            Signup
          </button>
        </form>
        <p className="text-center text-sm">
          Already a user ?{" "}
          <Link to="/login" className="text-blue-400 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <div>
        <p className="text-center text-[8px]">
          We collect and use your personal data to provide ride services,
          improve user experience, and ensure safety. Your information is
          securely stored and not shared without consent, except as required by
          law or to complete ride transactions.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
