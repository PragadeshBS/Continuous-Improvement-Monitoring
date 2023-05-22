import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Store } from "react-notifications-component";
import axios from "axios";

//form elements
import Input from "../../components/forms/Input/Input";
import Select from "../../components/forms/Select/Select";
import { set } from "mongoose";
import Loading from "../../components/Loading/Loading";

const StudentRegister = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //navigation
  const navigate = useNavigate();

  //state variables
  const [departmentNames, setDepartmentNames] = useState([]);
  const [departmentValues, setDepartmentValues] = useState([]);
  const [batchNames, setBatchNames] = useState([]);
  const [batchValues, setBatchValues] = useState([]);

  //function to select props
  function selectProps(...props) {
    return function (obj) {
      const newObj = [];
      props.forEach((name) => {
        newObj.push(obj[name]);
      });

      return newObj;
    };
  }

  //notifications
  const notify = (option) => {
    if (option == "success") {
      Store.addNotification({
        title: "Success!",
        message: `Welcome aboard! 😇`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3500,
          onScreen: true,
        },
      });
    } else {
      Store.addNotification({
        title: "Error!",
        message: `Error while Registering 😢`,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3500,
          onScreen: true,
        },
      });
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    axios
      .post("/api/students", data)
      .then((data) => {
        console.log(data);
        notify("success");
        navigate("/student");
      })
      .catch((err) => {
        setError(err.response.data.message);
        notify("error");
      });
  };

  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => {
        var data = res.data;
        console.log(data);
        setDepartmentNames(data.map(selectProps("dept_name")));
        setDepartmentValues(data.map(selectProps("_id")));
        axios
          .get("/api/batches")
          .then((res) => {
            var data = res.data;

            setBatchNames(
              data.map((data) => {
                return data.start_year + "-" + data.end_year;
              })
            );
            setBatchValues(data.map(selectProps("_id")));
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="card  w-75 mx-auto m-5 p-5">
      <div className="option-pane card-title d-flex flex-row justify-content-center ">
        <div className="display-6">Sign up (Student) </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col">
            <Input
              register={register}
              name="name"
              label="Name"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="roll_number"
              label="Roll Number"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="phone"
              label="Phone Number"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>

            <Select
              options={batchNames}
              values={batchValues}
              label={"Batch"}
              name="batch"
              register={register}
            />
            <Input
              register={register}
              name="city"
              label="City"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>

            <Input
              register={register}
              name="state"
              label="State"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="country"
              label="Country"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
          </div>
          <div className="col">
            <Input
              register={register}
              name="email"
              label="Email"
              type="email"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="password"
              label="Password"
              type="password"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="cpassword"
              label="Confirm Password"
              type="password"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Select
              options={departmentNames}
              values={departmentValues}
              label={"Department"}
              name="department"
              register={register}
            />
            <Input
              register={register}
              name="pincode"
              label="Pincode"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="address_line_1"
              label="Address Line-1"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
            <Input
              register={register}
              name="address_line_2"
              label="Address Line-2"
              type="text"
              conditions={{ required: true, maxLength: 100 }}
            ></Input>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger mx-auto mt-3 text-center w-75">
            {error}
          </div>
        )}
        <div className="form-group text-center mx-5 my-3">
          <input
            type="submit"
            className="btn btn-outline-dark  form-control w-25 my-3"
            value="Register"
          />
        </div>

        <div className="form-group text-center mx-5 my-3">
          <span>Already Having an account </span>
          <NavLink to={"auth/student/signin"}>Signin</NavLink>
        </div>
      </form>
    </div>
  );
};

export default StudentRegister;
