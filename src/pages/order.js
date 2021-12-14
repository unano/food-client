import React, {useState, useContext, useEffect} from "react";
import Head from "../components/head/head"
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./order.css";
import { FoodContext } from '../contexts/foodContext';
import FoodKinds from "../components/foodKinds"
import Foods from "../components/foods"
import ChosenFoods from "../components/chosenFoods"
import { NavigationType } from "react-router";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Order = () =>{
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState("null");
  const [foodKindId, setFoodKindId] = useState("");
  const [kindId, setKindId] =useState("");
  const [food, setFood] = useState("");
  const [price, setPrice] = useState("0");
  const [chosenFoodList, setChosenFoodList] = useState([]);
  const [chosenFood, setChosenFood] = useState();
  const [sumMoney, setSumMoney] = useState(0);
  const [deletes, setDeletes] = useState({})
  const [alert ,setAlert] = useState(false);
  const [alert2 ,setAlert2] = useState(false);
  const [unset, setUnset] = useState(false);
  const context = useContext(FoodContext);
  const foodKinds = context.foodKinds;
  const foods = context.foods;

  const navigate = useNavigate();

  useEffect(() =>{
    context.setChosenFoods(chosenFoodList);
    context.setMoney(sumMoney);
  }, [chosenFoodList, sumMoney])
  useEffect(() => {
    if(chosenFood){
      const inOrNot = chosenFoodList.filter(cFood => cFood.foodName===chosenFood.foodName && cFood.foodSize===chosenFood.foodSize);
      if(inOrNot.length===0) setChosenFoodList([...chosenFoodList, chosenFood]);
    }
  }, [chosenFood]);

  const amountSet = (value)=>{
    // name:chosenFood.foodName, size:chosenFood.foodSizesize, operation:-1
    chosenFoodList.map(cFood => cFood.foodName === value.name && cFood.foodSize === value.size? cFood.foodAmount+=value.operation :cFood);
  }

  const getMoney= () =>{
    var sum = 0;
    chosenFoodList.forEach(item =>{
      sum += item.foodPrice * item.foodAmount;
    })
    setSumMoney(sum);
  }

  const check0 = (value) =>{
    setAlert(true);
    setDeletes(value)
  }

  const unsetOther =(value) =>{
    setFoodKindId(value);
  }
  const setShowFunc = (value) =>{
    setShow(value);
  }

  const setIcons = (value) =>{
    if(food){
    if(value === icon){
      setIcon("null"); 
      calPrice("0");
    }
    else {
      setIcon(value);
      calPrice(value);
    }
  }
  }

  const doDelete =() =>{
    // name:chosenFood.foodName, size:chosenFood.foodSize
    var array = chosenFoodList;
    array = chosenFoodList.filter(cFood => !(cFood.foodName===deletes.name && cFood.foodSize===deletes.size));
    setChosenFoodList(array);
    setAlert(false);
    setUnset(true);
  }

  const doDeleteAll = () =>{
    var array = [];
    setChosenFoodList(array);
    setAlert2(false);
    setSumMoney(0);
  }

  const addToChosenList = () =>{
    if(price!=="0" && price!==0){
      const test = chosenFoodList.filter(cFood => cFood.foodName === food && cFood.foodSize === icon)
      if(test.length===0)
      setChosenFood({foodName:food, foodSize:icon, foodPrice:price, foodAmount:1});
      else
      chosenFoodList.map(cFood => cFood.foodName === food && cFood.foodSize === icon? cFood.foodAmount+=1 :cFood)
    }
  }

  const calPrice = (value) =>{
    const [choseFood] = foods.filter(food1 => food1.foodName === food);
    if(value === "S") setPrice(choseFood.price.small);
    if(value === "M") setPrice(choseFood.price.medium);
    if(value === "L") setPrice(choseFood.price.large);
    if(value === "0") setPrice("0");
  }

  const unsetSet =(value) =>{
    setUnset(value)
  }

  const payJump = () =>{
    if (sumMoney!==0){
        navigate('./check');
    }
  }
    return(
        <>
        <CSSTransition
                in={alert}
                timeout={300}
                classNames="alertStyle"
                unmountOnExit
              >
        <div className="deleteAlert">确定删除商品吗？<br/> Are you sure to delete this food?
        <div className="yesBtn" onClick={doDelete}>Yes</div>
        <div className="noBtn" onClick={() =>setAlert(false)}>No</div>
        </div>
        </CSSTransition>
        <CSSTransition
                in={alert2}
                timeout={300}
                classNames="alertStyle"
                unmountOnExit
              >
        <div className="deleteAlert2">确定删除所有商品吗？<br/> Are you sure to delete All food?
        <div className="yesBtn" onClick={doDeleteAll}>Yes</div>
        <div className="noBtn" onClick={() =>setAlert2(false)}>No</div>
        </div>
        </CSSTransition>
        <div className="orderBody">
        <Head/>
        <div className="menuLeft">
            <FoodKinds foodKinds={foodKinds} info={unsetOther} ifShow={foodKindId} leftOn={setShowFunc} setKindId={setKindId}/>
            <CSSTransition
                in={show}
                timeout={600}
                classNames="rightOpen"
                unmountOnExit
              >
            <div className="foodNames" onMouseOver={() => setShow(true)}>
              <div onClick={() => {setIcon("null"); calPrice("0");}}>
              <Foods foods={foods} kind={kindId} info={setFood}/>
              </div>
            </div>
            </CSSTransition>
            <div className="foodPic">
              <div className="foodPicLarge"></div>
              <div className="foodPicSmall">
                <div className="foodNameUnder">{food}</div>
                <div className={icon==="S"?"foodsizeIconOn":"foodsizeIcon"} onClick={() => setIcons("S")}>S</div>
                <div className={icon==="M"?"foodsizeIconOn":"foodsizeIcon"} onClick={() => setIcons("M")}>M</div>
                <div className={icon==="L"?"foodsizeIconOn":"foodsizeIcon"} onClick={() => setIcons("L")}>L</div>
                <div className="foodPrize">$ {price} </div>
                <div className="foodsizeIcon" onClick={addToChosenList}>+</div>
              </div>
            </div>
        </div>
        <div className="menuRight">
        <div className="menuRightTitle">已選</div>
        <div className="deleteAll" onClick={() => setAlert2(true)}>清空</div>
          <ChosenFoods foodlist={chosenFoodList} getMoney={getMoney} amountSet={amountSet} check0={check0} unset={unset} unsetSet={unsetSet}/>
          <div className="totalMoney">
          <div className="totalMoneyTitle">總計</div>
          <div className="totalMoneyMoney">${sumMoney}</div>
          </div>
          <div className="pay" onClick={payJump}>付款</div>
        </div>
        </div>
        </>
    )
}

export default Order;