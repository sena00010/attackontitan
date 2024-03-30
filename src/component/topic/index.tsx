"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./header.module.css";
import CharacterDetails from "@/component/characterDetails";
import { useAtom } from 'jotai';
import {cartAtoms} from "@/atoms/cartAtoms";

interface Character {
  id: number;
  img: string;
  name: string;
  birthplace: string;
}

interface Results {
  info: [];
  results: Character[];
}

export default function Character() {
  const [data, setData] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDetails, setOpenDetails] = useState(false);
  const[selectedChar, setSelectedChar]= useState<any>([]);
  const[products,setProducts]=useAtom(cartAtoms);
  const [characterCartStatus, setCharacterCartStatus] = useState<{ [key: number]: boolean }>({});
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  let totalPage;
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://api.attackontitanapi.com/characters?page=${currentPage}`;
        const response = await axios.get<Results>(apiUrl);
        setData(response.data.results);
        // @ts-ignore
        totalPage = response.data.info["pages"] as any;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = 10; // You should replace this with the actual total number of pages from your API
  const filteredData = data?.filter((item) => item.img);
  return (
    <div className={styles.main}>
      <div className={styles.container} >
        {filteredData?.map((item: Character, index: number) => (
          <div key={index} className={styles["character-card"]} onClick={() => {
            setOpenDetails(!openDetails)
            console.log(products,'productsssssssssssssss')

            // item?.id===index+1 && setSelectedChar(item)
            // console.log(selectedChar,'selectedChar')
            // console.log(index,'index')
            // console.log(item?.id,'item.id')
            // const selectedSena=  filteredData?.filter(selectedItem=>
            // selectedItem.id===item.id)
            setSelectedChar(item);
          }
          } >
            <div key={index}>{item.name}</div>
            {item.img ? (
              <Image src={item.img} width={200} height={200} alt={item.name} />
            ) : undefined}
            <div key={index}>{item.birthplace}</div>
            <div> <button onClick={(e)=> {
              e.stopPropagation()
              const updatedStatus= {...characterCartStatus}
              updatedStatus[item.id]=true;
              setCharacterCartStatus(updatedStatus)
              setProducts([...products, item])

            }
            }>{characterCartStatus[item.id]?('Sepete Eklendi'):('Sepete Ekle')}</button></div>
          </div>

        ))}
      </div>
      <footer className={styles["pagination-footer"]}>
        <div className={styles.pagination}>
          <button
            className={`${styles["page-arrow"]} ${styles.disabled}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <div
              key={page}
              className={`${styles["page-number"]} ${
                page === currentPage ? styles.active : ""
              }`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </div>
          ))}
          <button
            className={styles["page-arrow"]}
            onClick={handleNextPage}
            disabled={!totalPages}
          >
            {totalPages}
          </button>
        </div>
      </footer>
      <CharacterDetails opened={openDetails} data={selectedChar} setClosed={setOpenDetails}/>
    </div>

  );
}
Character

//tıklanan characterin detayını aktar,filter