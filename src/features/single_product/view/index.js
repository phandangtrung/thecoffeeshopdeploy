import React, { useEffect, useState } from "react";
import "./style.css";
import {
  Row,
  Col,
  Button,
  Form,
  InputNumber,
  Tabs,
  Rate,
  Pagination,
  Input,
  Result,
  Spin,
  notification,
  Empty,
  Menu,
  Dropdown,
  Popconfirm,
} from "antd";
import Cookies from "js-cookie";
import {
  ShoppingCartOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import CurrencyFormat from "react-currency-format";

import commentApi from "../../../api/commentApi";

import productApi from "../../../api/productApi";
import ProductTag from "../../../components/ProductTag";

import {
  SmileOutlined,
  ExceptionOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";

import { Images } from "../../../config/image";
const { TabPane } = Tabs;

function SingleProduct({ props }) {
  let location = useLocation();

  const [isloadProduct, setloadProduct] = useState(false);
  const [BraProList, setBraProList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [statusbr, setstatusbr] = useState(true);
  const [dfSelect, setDfSelect] = useState("");
  const [fakeproductList, setfakeProductList] = useState([]);
  const [form] = Form.useForm();
  const addtoCart = (prorec) => {
    // console.log(">>>product : ", props.name, " ", props._id, " ", props.price);
    // localStorage.clear();
    try {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (cart === null) {
        cart = [];
        cart.push({
          key: prorec._id,
          product_id: prorec._id,
          name: prorec.name,
          size: "M",
          price_L: prorec.size_L,
          quantity: 1,
          price: prorec.prices,
          storequantity: prorec.storequantity,
        });
      } else {
        let check_available = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].product_id === prorec._id) {
            cart[i].quantity = cart[i].quantity + 1;
            check_available = true;
          }
        }
        if (check_available !== true) {
          cart.push({
            key: prorec._id,
            product_id: prorec._id,
            name: prorec.name,
            size: "M",
            quantity: 1,
            price_L: prorec.size_L,
            price: prorec.prices,
            storequantity: prorec.storequantity,
          });
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      console.log("Cart>>", localStorage.cart);
      notification.open({
        message: `${prorec.name}`,
        description: `${prorec.name} đã được thêm vào giỏ hàng`,
        placement: "bottomRight",
        icon: <ShoppingCartOutlined style={{ color: "# rgb(164, 115, 67)" }} />,
      });
    } catch {
      notification.open({
        message: "Thêm vào giỏ không thành công",
        description: "Something went wrong",
        icon: <ExclamationCircleFilled style={{ color: "#red" }} />,
      });
    }
  };
  const fetchBranchList = async () => {
    try {
      setloadProduct(true);
      const Brresponse = await productApi.getBranch();
      console.log("Fetch branch succesfully: ", Brresponse.branches);
      const Prresponse = await productApi.getAll();
      console.log("Fetch products succesfully: ", Prresponse.productList);
      let newBraL = [];
      Brresponse.branches.map((bl) => {
        let newproLi = { ...bl, listProduct: [] };
        bl.listProduct.map((brpro) => {
          const found = Prresponse.productList.find(
            (element) => element._id === brpro._id
          );
          newproLi.listProduct.push({ ...brpro, ...found });
        });
        newBraL.push(newproLi);
      });
      console.log(">>newBraL", newBraL);
      setBraProList(newBraL);

      const checkidb = JSON.parse(localStorage.getItem("branchID"));
      console.log(">>checkidb", checkidb);
      if (checkidb === null) {
        localStorage.setItem("branchID", JSON.stringify(newBraL[0]._id));
        // form.setFieldsValue({
        //   selectBrid: newBraL[0].name,
        // });
        setProductList(
          newBraL[0].listProduct.filter((prd) => prd.name !== undefined)
        );
        setstatusbr(newBraL[0].status);
      } else {
        const bralready = newBraL.filter((nb) => nb._id === checkidb);
        console.log(">>bralready", bralready);
        // form.setFieldsValue({
        //   selectBrid: bralready[0].name,
        // });

        let newlistb = bralready[0].listProduct.filter(
          (prd) => prd.name !== undefined
        );
        setProductList(
          newlistb.filter(
            (nl) =>
              nl.categoryId === location.state.categoryId &&
              nl._id !== location.state.idpro
          )
        );
        console.log(">>>trung ne", location.state.idpro);
        setstatusbr(bralready[0].status);
      }

      setDfSelect(String(newBraL[0].name));
      // console.log(">>newBraL[0].name", newBraL[0].name);
      let checkproductwr = newBraL[0].listProduct.filter(
        (prd) => prd.name !== undefined
      );
      // console.log(">>checkproductwr", checkproductwr);
      // setfakeProductList(newBraL[0].listProduct);
      setfakeProductList(
        checkproductwr.filter(
          (nl) =>
            nl.categoryId === location.state.categoryId &&
            nl._id !== location.state.idpro
        )
      );
      setloadProduct(false);
    } catch (error) {
      console.log("failed to fetch product list: ", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBranchList();
  }, []);
  const handleSubmit = (values) => {
    console.log("Value: ", values);
    console.log(">>productname: ", location.state);
    location.addtoCart();
  };
  const changePage = (values) => {
    if (values <= 1) {
      setpaginaPage({
        minValue: 0,
        maxValue: 3,
      });
    } else {
      setpaginaPage({
        minValue: paginaPage.maxValue,
        maxValue: values * 3,
      });
    }
  };
  const onChange = () => {
    console.log("Change!");
  };
  const ondeleteComment = (_id) => {
    console.log("avcd", _id);
    const fetchCommentList = async () => {
      // dispatch({ type: "FETCH_INIT" });
      try {
        setloadcomment(true);
        // const params = { _page: 1, _limit: 10 };
        const response = await commentApi.deletecomment(_id);
        console.log("Fetch comment succesfully: ", response);
        setcommentList(commentList.filter((cmmt) => cmmt._id !== _id));
        setloadcomment(false);
      } catch (error) {
        console.log("failed to fetch product list: ", error);
      }
    };
    fetchCommentList();
  };

  useEffect(() => {
    // productapi
    const fetchProductList = async () => {
      // dispatch({ type: "FETCH_INIT" });
      try {
        setloadcomment(true);
        // const params = { _page: 1, _limit: 10 };

        const response = await commentApi.getcommentbyProId(
          location.state.idpro
        );
        console.log("Fetch products succesfully: ", response);
        setcommentList(response.comments);
        setloadcomment(false);
      } catch (error) {
        console.log("failed to fetch product list: ", error);
      }
    };
    fetchProductList();
  }, []);
  const hanldecomment = (values) => {
    const datacomment = {
      ...values,
      rating: ratevalue,
      productId: location.state.idpro,
      email: emailCustomer,
    };
    const fetchProductList = async () => {
      // dispatch({ type: "FETCH_INIT" });
      try {
        setloadcomment(true);
        const response = await commentApi.createcomment(datacomment);
        console.log("Fetch products succesfully: ", response);
        setcommentList([...commentList, response.newComment]);
        setloadcomment(false);
        notification.open({
          message: "Bạn đã đăng một bình luận",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
      } catch (error) {
        notification.open({
          message: "Có gì đó khổng ổn rồi, thử lại sau",
          icon: <ExceptionOutlined style={{ color: "#red" }} />,
        });
        console.log("failed to fetch product list: ", error);
      }
    };
    fetchProductList();
    console.log(">>comment", datacomment);
  };
  const tokenCustomer = Cookies.get("tokenCustomer");
  const emailCustomer = Cookies.get("CustomerEmail");
  const [commentList, setcommentList] = useState([]);
  const [loadcomment, setloadcomment] = useState(false);
  const [paginaPage, setpaginaPage] = useState({
    minValue: 0,
    maxValue: 1,
  });
  const { TextArea } = Input;
  const [ratevalue, setratevalue] = useState(3);
  const desc = ["Rất tệ", "Tệ", "Tạm", "Tốt", "Rất tốt"];
  const handleChangeRate = (value) => {
    setratevalue(value);
  };
  return (
    <div className="container">
      <div className="sproduct-form">
        <Row>
          <Col style={{ textAlign: "start" }} span={12}>
            <img
              alt="single-product"
              src={`https://betcsvn.herokuapp.com/${location.state.img}`}
            />
          </Col>
          <Col span={12}>
            <div className="title">{location.state.namepro}</div>
            <div className="price">
              <CurrencyFormat
                value={location.state.pricepro}
                displayType={"text"}
                thousandSeparator={true}
              />{" "}
              VND
            </div>

            <Form onFinish={handleSubmit}>
              <div className="description-form">
                <div className="content">{location.state.despro}</div>
              </div>

              <div className="button-form">
                {location.state.quantity > 0 ? (
                  <Button className="button-buy" htmlType="submit">
                    MUA NGAY
                  </Button>
                ) : (
                  <a className="amount">Out of stock</a>
                )}
              </div>
            </Form>
          </Col>
        </Row>
        <Row style={{ paddingTop: "40px" }}>
          <div
            style={{
              textShadow: "0.5px 0.5px #9ea19d",
              fontSize: "30px",
              color: "#3b3838",
              fontFamily: "Bangers",
            }}
          >
            Có thể bạn thích
          </div>
        </Row>
        <Row
          style={{
            paddingTop: "40px",
            height: "400px",
            marginBottom: "30px",
          }}
        >
          {isloadProduct ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Spin size="large" />
            </div>
          ) : (
            productList.map((product) => (
              <Col lg={8} xs={24} sm={24} key={product._id}>
                {/* <ProductTag
                  _id={product._id}
                  name={product.name}
                  img={product.imagesProduct}
                  price={product.prices}
                  quantity={product.quantity}
                  size_L={product.size_L}
                  description={product.description}
                  storequantity={product.quantity}
                /> */}
                <div
                  style={{
                    width: "300px",
                  }}
                >
                  <div style={{ width: "auto", height: "230px" }}>
                    <img
                      alt="picture"
                      src={`https://betcsvn.herokuapp.com/${product.imagesProduct}`}
                    />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      lineHeight: "30px",
                    }}
                  >
                    <div
                      style={{
                        width: "80%",
                        height: "100px",
                        backgroundColor: "#f2f0eb",
                        textAlign: "center",
                        paddingTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          textShadow: "0.5px 1.5px #9ea19d",
                          fontSize: "25px",
                          color: "#3b3838",
                          fontFamily: "Bangers",
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          color: "rgb(164, 115, 67)",
                          fontFamily: "Bangers",
                        }}
                      >
                        <CurrencyFormat
                          value={product.prices}
                          displayType={"text"}
                          thousandSeparator={true}
                        />{" "}
                        VND
                      </div>
                      <div
                        className="menu-detail"
                        style={{
                          paddingTop: "0px",
                          height: "auto",
                          paddingBottom: "10px",
                        }}
                      >
                        <div
                          className="button-form "
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button onClick={() => addtoCart(product)}>
                            MUA NGAY
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
        <Row>
          <div className="tabs-rating">
            <Tabs type="card" size="large">
              <TabPane tab="Đánh giá và Bình luận" key="1">
                <Spin spinning={loadcomment}>
                  {commentList.length > 0 ? (
                    <div className="rate-container">
                      {commentList.map((comment) => (
                        <div className="rate-form" key={comment._id}>
                          <div className="rate-username">
                            {comment.email}
                            {comment.email === emailCustomer ? (
                              <Popconfirm
                                title="Are you sure？"
                                onConfirm={() => ondeleteComment(comment._id)}
                                icon={
                                  <QuestionCircleOutlined
                                    style={{ color: "red" }}
                                  />
                                }
                              >
                                <DeleteOutlined
                                  style={{
                                    marginLeft: "10px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    color: "#808080",
                                  }}
                                />
                              </Popconfirm>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="rate-start">
                            <Rate disabled defaultValue={comment.rating} />
                          </div>
                          <div className="rate-comment">{comment.content}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description={false} />
                  )}
                </Spin>
              </TabPane>
              <TabPane
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "30px",
                }}
                tab="Đánh giá của bạn"
                key="3"
              >
                {tokenCustomer !== undefined ? (
                  <Form style={{ width: "80%" }} onFinish={hanldecomment}>
                    <Spin spinning={loadcomment}>
                      <Form.Item name="content">
                        <TextArea
                          placeholder="Nhập bình luận của bạn"
                          autoSize={{ minRows: 5, maxRows: 8 }}
                        />
                      </Form.Item>
                      <div
                        style={{
                          textAlign: "start",
                          zoom: "1.2",
                          paddingBottom: "20px",
                        }}
                      >
                        <Rate
                          tooltips={desc}
                          onChange={handleChangeRate}
                          value={ratevalue}
                        />
                        {ratevalue ? (
                          <span className="ant-rate-text">
                            {desc[ratevalue - 1]}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <Button
                        htmlType="submit"
                        type="primary"
                        style={{ float: "left", border: "0px" }}
                      >
                        Bình luận
                      </Button>
                    </Spin>
                  </Form>
                ) : (
                  <Result
                    status="warning"
                    title="Bạn phải đăng nhập mới có thể bình luận."
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default SingleProduct;
