import axios, { AxiosInstance } from "axios";
import { guidiniApiUrl, guidiniApiKey, guidiniApiSecret } from "@constants";

export class GuidiniApi {
  private static api: AxiosInstance = axios.create({
    baseURL: guidiniApiUrl,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-app-key": guidiniApiKey,
      "x-app-secret": guidiniApiSecret,
    },
  });

  static async createPayment(amount: number): Promise<any> {
    try {
      const response = await this.api.post("/payment/initiate", { amount });
      
      return response.data;
    } catch (error: any) {
      console.error("Error creating payment:", error.response?.data || error.message);
      throw error;
    }
  }

  static async verifyPayment(orderNumber: string): Promise<any> {
    try {
      // CORRECT: Use params for GET requests, not data
      const response = await this.api.get("/payment/show", {
        params: { order_number: orderNumber }  // Changed from data to params
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Error verifying payment:", error.response?.data || error.message);
      throw error;
    }
  }
}
