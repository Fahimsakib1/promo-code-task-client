import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'
import { FiEdit } from 'react-icons/fi';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import EditPromoCodeModal from './EditPromoCodeModal';


const Home = () => {


    //For Modal
    const [newPromoCodeInfo, setNewPromoCodeInfo] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleAddPromoCodes = (data) => {

        const promoCodeInfo = {
            promo_code: data.promoCode,
            discount: data.discount
        }

        fetch('https://promo-code-server-eight.vercel.app/PromoCodes', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(promoCodeInfo)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.acknowledged) {
                    toast.success(`Promo Code ${data.promoCode} Has Been Added Successfully.`);
                    reset();
                    refetch();
                }

                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! Try Agin',
                    })
                }
            })

    }



    const handleApplyPromoCode = (event) => {
        event.preventDefault();
        console.log(event.target.applyPromoCode.value)
        const promoCode = event.target.applyPromoCode.value;

        fetch(`https://promo-code-server-eight.vercel.app/PromoCodes/${promoCode}`)
            .then(res => res.json())
            .then(data => {
                console.log("Discount Data From Backend", data)
                if (data.acknowledged) {
                    Swal.fire(
                        'Promo Code Matched!',
                        `Congratulations! You Got ${data.result.discount} % discount`,
                        'success'
                    )
                }

                else {
                    Swal.fire({
                        icon: 'error',
                        title: `${data.message}`,
                        text: 'Please apply with correct Promo Code'
                    })

                }
                event.target.reset();
            })


    }


    const { data: allPromoCodes = [], refetch, isLoading } = useQuery({
        queryKey: ['allPromoCodes'],
        queryFn: () => fetch('https://promo-code-server-eight.vercel.app/AllPromoCodes')
            .then(res => res.json())
    })



    refetch();


    //Delete Promo Code
    const handleDeletePromoCode = (id, name) => {
        console.log("Promo Code Id", id + " and Promo Code Name", name);
        fetch(`https://promo-code-server-eight.vercel.app/deletePromoCode/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(result => {
                if (result.deletedCount > 0) {
                    toast.success(`Promo Code ${name} Deleted Successfully.`);
                    refetch();
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops... Something Went Wrong',
                        text: 'Can not Delete Promo Code. Try Again'
                    })
                }
            })
    }




    const [promoCodeData, setPromoCodeData] = useState({})


    //Edit Promo Code
    const handleEditPromoCode = (data) => {
        console.log("Modal Edit Promo Code", data.promoCode + " and Discount", data.discount);

        const { _id } = newPromoCodeInfo;
        console.log("HHHHHHHHHHHHHHHHHHHH", _id)

        const updatedPromoCodeInfo = {
            promo_code: data.promoCode,
            discount: data.discount
        }

        console.log("Updated Promo Code ", updatedPromoCodeInfo)


        fetch(`https://promo-code-server-eight.vercel.app/updatePromoCode/${_id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(updatedPromoCodeInfo)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.modifiedCount > 0) {
                    // toast.success(`Promo Code Updated Successfully.`);s
                    Swal.fire(
                        `Good Job`,
                        'Promo Code Updated',
                        'success'
                    )
                    closeModal()
                }
                else {
                    closeModal()
                }
            })

    }

    const closeModal = () => {
        setNewPromoCodeInfo(null)
    }


    if (isLoading) {
        return <div className="h-28 w-28 border-8 border-dashed rounded-full animate-spin border-blue-600 mx-auto mt-64"></div>
    }




    return (
        <div className='flex justify-center items-center gap-x-8 mt-10 md:flex-col lg:flex-row flex-col'>

            <div className=' '>

                {/* Add Promo Code To Database*/}
                <div className='p-6  rounded-lg  w-[350px] sm:w-3/4  md:w-[600px]  mx-2 sm:mx-2 md:mx-2 lg:mx-0 shadow-2xl bg-gray-800 border-b-8 border-amber-600 '>
                    <h1 className='text-center text-xl font-bold text-amber-600'>Add Your Promo Code</h1>
                    <form onSubmit={handleSubmit(handleAddPromoCodes)}>
                        <div className="form-control w-full mb-1">
                            <label className="label">
                                <span className="label-text font-semibold text-white ">Promo Code</span>
                            </label>
                            <input defaultValue={promoCodeData.promo_code ? promoCodeData.promo_code : ''} type="text" {...register("promoCode", { required: "Promo Code is Required" })}
                                placeholder="Enter Promo Code" className="input input-bordered w-full" />
                            {errors.promoCode && <p className='text-red-600'>{errors.promoCode?.message}</p>}
                        </div>


                        <div className="form-control w-full mb-1">
                            <label className="label">
                                <span className="label-text font-semibold text-white">Discount (%)</span>
                            </label>
                            <input defaultValue={promoCodeData.discount ? promoCodeData.discount : ''} type="number" {...register("discount", { required: "Discount is Required" })}
                                placeholder="Enter Discount Percentage" className="input input-bordered w-full" />
                            {errors.discount && <p className='text-red-600'>{errors.discount?.message}</p>}
                        </div>

                        <input type="submit"
                            value='Add'
                            className='btn btn-primary w-full text-white uppercase py-3 rounded-md mt-4 mb-2' />
                    </form>
                </div>


                {/* Apply Promo Code Div */}
                <div className='p-6  rounded-lg  w-[350px] sm:w-3/4  md:w-[600px]  mx-2 sm:mx-2 md:mx-2 lg:mx-0 mt-10 bg-gray-800 mb-4 border-b-8 border-lime-600'>
                    <form onSubmit={handleApplyPromoCode}>
                        <div className="form-control w-full mb-1">
                            <label className="label">
                                <span className="label-text font-semibold text-white ">Apply Promo Code</span>
                            </label>
                            <input type="text" name='applyPromoCode' placeholder="Enter Promo Code" className="input input-bordered w-full" required />
                        </div>
                        <button className='btn btn-primary w-full mt-6'>Apply Promo Code</button>
                    </form>

                </div>

            </div>



            <div className="lg:mt-0 mt-6 mb-10 w-[350px] sm:w-3/4  md:w-[650px]">
                {
                    allPromoCodes.length > 0 ?
                        <div>
                            <h1 className='text-center font-semibold text-xl my-4  border-b-4 border-violet-500 w-3/4 mx-auto'>All Promo Code Details</h1>

                            <table className="table table-zebra w-full border-2">

                                <thead>
                                    <tr>
                                        <th className='border-2 text-center text-[14px]'>Serial</th>
                                        <th className='border-2 text-center text-[14px]'>Promo Code</th>
                                        <th className='border-2 text-center text-[14px]'>Discount (%)</th>
                                        <th className='border-2 text-center text-[14px]'>Edit</th>
                                        <th className='border-2 text-center text-[14px]'>Delete</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        allPromoCodes.map((promoCode, index) =>
                                            <tr className='border-2 text-center' key={promoCode._id}>
                                                <th className='text-[17px] font-semibold'>{index + 1}</th>
                                                <td className='text-[17px]'>{promoCode.promo_code}</td>
                                                <td className='text-[17px]'>{promoCode.discount}%</td>
                                                <td className='flex justify-center'>
                                                    <label onClick={() => setNewPromoCodeInfo(promoCode)}
                                                        htmlFor="update-promoCode-modal"
                                                    >
                                                        <FiEdit className='text-2xl font-bold text-blue-700  '>
                                                        </FiEdit>
                                                    </label>
                                                </td>
                                                <td className=''><FaTrashAlt onClick={() => handleDeletePromoCode(promoCode._id, promoCode.promo_code)} className='text-2xl font-bold flex justify-center ms-6 -mt-1 text-rose-600'></FaTrashAlt></td>
                                            </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>

                        :

                        <div>
                            <h1 className='text-3xl text-gray-500 font-bold text-center'>No Promo Codes Added Yet </h1>
                            <p className='text-lg text-gray-500 text-center'>Please add Promo Code to view here</p>
                        </div>
                }

            </div>

            {
                newPromoCodeInfo &&
                <EditPromoCodeModal
                    closeModal={closeModal}
                    handleEditPromoCode={handleEditPromoCode}
                    newPromoCodeInfo={newPromoCodeInfo}
                >
                </EditPromoCodeModal>
            }


        </div>
    );
};

export default Home;