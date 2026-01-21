import { use, useState } from "react";
import axios from "axios";


import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
const [isAuth, setIsAuth] = useState(false);

const [products, setProducts] = useState([])
const [tempProduct, setTempProduct] = useState();

const handleInputChange = (e) => {
  const { name, value } = e.target;
  //console.log(name, value);
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
    setProducts(response.data.products);
  } catch (error) {
 console.log(error.response);
  }
};

const onSubmit = async (e) => {
   e.preventDefault();
 try {
   const response = await axios.post(`${API_BASE}/admin/signin`, formData);
    const { token, expired } = response.data;
    document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
    axios.defaults.headers.common["Authorization"] = token;   
  
  getProducts();  
  setIsAuth(true); 
 } catch (error) {
  setIsAuth(false);
  console.log(error.response);
  alert("登入失敗");
 } 
};

const checkLogin = async () => {
  try {
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
    axios.defaults.headers.common["Authorization"] = token;   

    const response = await axios.post(`${API_BASE}/api/user/check`);
    console.log(response.data); 
  } catch (error) {
    console.log(error.response?.data.message)
  }
};

  return (
    <>
    {!isAuth ? (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={(e)=> onSubmit(e)}>
      <div className="form-floating mb-3">
  <input type="email" 
         className="form-control" 
         name="username" 
         placeholder="name@example.com"
         value={formData.username} 
         onChange={(e)=> handleInputChange(e)}
         />
  <label htmlFor="username">Email address</label>
</div>
<div className="form-floating">
  <input type="password" 
  className="form-control" 
  name="password" 
  placeholder="Password" 
  value={formData.password}
  onChange={(e)=> handleInputChange(e)}  
  />
  <label htmlFor="password">Password</label>
</div>
<button type="submit" className="btn btn-success w-100 mt-2">登入</button>
      </form>
      </div>
      ):(
    <div className="container">
       <div className="row mt-2">
            <div className="col-md-6">
              <button className="btn btn-danger mb-5"
      type="button"
      onClick={() => checkLogin()}
      >
        確認是否登入成功
      </button>
                <h2>產品列表</h2>
                <table className="table table-striped table-hover">
                    <thead>
    <tr>
      <th scope="col">產品名稱</th>
      <th scope="col">原價</th>
      <th scope="col">售價</th>
      <th scope="col">是否啟用</th>
      <th scope="col">查看細節</th>
    </tr>
  </thead>
  <tbody>
      {
      products.map(product => (
        <tr key={product.id}>
      <th scope="row">{product.title}</th>  
      <td>{product.origin_price}</td>
      <td>{product.price}</td>
      <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
      <td><button type="button" className="btn btn-outline-secondary"
      onClick={() => setTempProduct(product)}>查看</button>
</td>
    </tr>
        ))
        }
  </tbody>
</table>
                </div>
            <div className="col-md-6">
                <h2>產品明細</h2>
                {tempProduct ? (
                    <div className="card">
  <img src={tempProduct.imageUrl} style={{height: "400px"}} alt="主圖" />
  <div className="card-body">
    <h5 className="card-title">{tempProduct.title}
      <span className="badge bg-primary ms-2">{ tempProduct.category }</span>
    </h5>
    <p className="card-text">
        商品描述：{tempProduct.description} </p>
  <p className="card-text">
        商品內容：{tempProduct.content} 
    </p>
        <div className="d-flex">
            <del className="text-secondary">{tempProduct.origin_price}</del> 元 / <span className="text-secondary">{tempProduct.price}</span> 元
            </div> 
<h5 className="card-title">更多圖片</h5> 
<div className="d-flex flex-wrap">
    {tempProduct.imagesUrl.map((Url, index) => ( <img key={index} src={Url} style={{height: "200px", marginRight: "8px"}} />
        ))}
  </div>
</div>
                    </div>
                ) : (
                    <p>請選擇產品</p>
                )}
            </div>
     </div>
    </div>
      )}
      </>
  );
}

export default App