"use client"
import {cartAtoms} from "@/atoms/cartAtoms";
import { useAtom } from 'jotai';
import styles from '../cartComp/cart.module.css'

export default function Cart() {
    const[product,setproduct] = useAtom(cartAtoms)
    console.log(product,'product')
    return (
        <div>
            <div  className={styles.cart}>
                {product.map((item)=>{
                    return(
                        <div className={styles.cartItem}>
                            <div  className={styles.productName}>{item.name}</div>
                        </div>
                    )
                })}
                <div>100 tl</div>
            </div>
        </div>
    )
}