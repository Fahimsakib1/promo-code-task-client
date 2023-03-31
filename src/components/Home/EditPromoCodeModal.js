import React from 'react';
import { useForm } from 'react-hook-form';

const EditPromoCodeModal = ({ closeModal, handleEditPromoCode, newPromoCodeInfo }) => {

    const { _id, promo_code, discount } = newPromoCodeInfo;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    return (
        <div>
            <input type="checkbox" id="update-promoCode-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label onClick={closeModal} htmlFor="update-promoCode-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

                    <h3 className="text-lg font-bold mt-4 text-center"> Want To Update Promo Code {promo_code}?</h3>

                    <form onSubmit={handleSubmit(handleEditPromoCode)}>
                        <div className="form-control w-full mb-1">
                            <label className="label">
                                <span className="label-text font-semibold ">Promo Code</span>
                            </label>
                            
                            <input defaultValue={promo_code ? promo_code : ''} type="text" {...register("promoCode", { required: "Promo Code is Required" })}
                                placeholder="Enter Promo Code" className="input input-bordered w-full" />

                        </div>


                        <div className="form-control w-full mb-1">
                            <label className="label">
                                <span className="label-text font-semibold">Discount (%)</span>
                            </label>

                            <input defaultValue={discount ? discount : ''} type="number" {...register("discount", { required: "Discount is Required" })}
                                placeholder="Enter Discount" className="input input-bordered w-full" />

                        </div>

                        <input type="submit"
                            value='Update Promo Code'
                            htmlFor="update-promoCode-modal"
                            className='btn btn-primary w-full text-white uppercase py-3 rounded-md mt-4 mb-2' />
                    </form>




            

























                    {/* <label
                        onClick={() => handleEditPromoCode(_id, promo_code, discount)}
                        htmlFor="update-promoCode-modal" className="btn btn-success w-full mt-4  border-0 text-white">Update
                    </label> */}


                </div>
            </div>
        </div>
    );
};

export default EditPromoCodeModal;