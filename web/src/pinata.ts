import axios from "axios";

export async function uploadToPinata(file: File, jwt: string): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const formData = new FormData();
  formData.append("file", file);

  const token = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;

  const res = await axios.post(url, formData, {
    headers: { Authorization: token },
    maxBodyLength: Infinity,
  });
  return res.data.IpfsHash as string;
}