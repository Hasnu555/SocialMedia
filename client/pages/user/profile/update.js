import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Avatar } from "antd";
import Link from "next/link";
import UpdateForm from "../../../components/forms/UpdateForm";
import { useRouter } from "next/router";

import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
import { LoadingOutlined, CameraOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const[token, setToken] = useState("")
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  // const token = localStorage.getItem("token");

  useEffect(() => {
    if (state && state.user) {
      // const token = state.token;
      setToken(state.token);
      setName(state.user.name);
      setAge(state.user.age);
      setEmail(state.user.email);
      setImage(state.user.image);
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('email', email);
      if (image) formData.append('image', image);

      const { data } = await axios.put(`http://localhost:5000/selfProfile`, formData, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({ ...state, user: data });
        setOk(true);
        setLoading(false);
      }
    } catch (err) {
      console.log("Error while updating profile => ", err);
      toast.error(err.message);
      setLoading(false);
    } finally {
      setUploading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <UserRoute>
    <div className="container-fluid">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Profile</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <UpdateForm
            profileUpdate={true}
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            age={age}
            setAge={setAge}
            email={email}
            setEmail={setEmail}
            loading={loading}
            handleImage={handleImage}
            image={image}
            uploading={uploading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Modal
            title="Congratulations!"
            open={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>You have successfully updated your profile.</p>
          </Modal>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Already registered? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
    </UserRoute>
  );
};

export default ProfileUpdate;
