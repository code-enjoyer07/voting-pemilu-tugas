"use client"
import { ENV } from "@/env";
import { Fetch } from "@/utils/Fetch";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const fetchProvinces = async () => {
    try {
      const response = await Fetch.get("/province", {
        headers: {
          Authorization: `Bearer ${ENV.TOKEN}`,
        },
      });
      if (Array.isArray(response.data)) {
        setProvinces(response.data);
      } else {
        setProvinces([]);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceId: number) => {
    const response = await Fetch.get(`/city?province_id=${provinceId}`, {
      headers: {
        Authorization: `Bearer ${ENV.TOKEN}`,
      },
    });
    setCities(response.data);
  };

  const postResult = async () => {
    if (!selectedCandidate || !selectedProvince || !selectedCity) {
      return;
    }

    const resultData = {
      number: selectedCandidate.id,
      presiden: selectedCandidate.name,
      wakil_presiden: selectedCandidate.wakil_presiden,
      province_id: selectedProvince.id,
      city_id: selectedCity.id,
    };

    try {
      const response = await Fetch.post("/results", resultData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasVoted(true);
    } catch (error) {
      console.error("Error posting result:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);

    fetchProvinces();

    const checkIfVoted = async () => {
      try {
        const response = await Fetch.get("/results", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.data.status == 404) {
          setHasVoted(false);
        } else {
          setHasVoted(true);
        }
      } catch (error) {
        console.error("Error checking if user has voted:", error);
      }
    };

    if (storedToken) {
      checkIfVoted();
    }
  }, []);

  const candidates = [
    { id: "01", name: "Anies Baswedan", wakil_presiden: "Muhaimin Iskandar", img: "/1.jpeg" },
    { id: "02", name: "Prabowo Subianto", wakil_presiden: "Gibran Rakabumin", img: "/2.jpeg" },
    { id: "03", name: "Ganjar Pranowo", wakil_presiden: "Mahfud MD", img: "/3.jpeg" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {token ? (
        <>
          {hasVoted ? (
            <div className="text-center text-xl font-bold text-green-600">
              Anda sudah memilih!
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6 w-full">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Pilih Kandidat Pemilu</h1>

              <div className="mt-4">
                <label className="block text-gray-700">Pilih Kandidat Presiden</label>
                <select
                  className="mt-2 w-full p-2 border rounded"
                  onChange={(e) => {
                    const candidateId = e.target.value;
                    setSelectedCandidate(candidates.find((candidate) => candidate.id === candidateId));
                  }}
                  disabled={hasVoted}
                >
                  <option value="">-- Pilih Kandidat Presiden --</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Pilih Provinsi</label>
                <select
                  className="mt-2 w-full p-2 border rounded"
                  onChange={(e) => {
                    const provinceId = parseInt(e.target.value);
                    setSelectedProvince(provinces.find((province) => province.id === provinceId));
                    fetchCities(provinceId);
                  }}
                  disabled={hasVoted}
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.length === 0 ? (
                    <option value="">Loading provinces...</option>
                  ) : (
                    provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.province}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {selectedProvince && (
                <div className="mt-4">
                  <label className="block text-gray-700">Pilih Kota</label>
                  <select
                    className="mt-2 w-full p-2 border rounded"
                    onChange={(e) => {
                      const cityId = parseInt(e.target.value);
                      setSelectedCity(cities.find((city) => city.id === cityId));
                    }}
                    disabled={hasVoted}
                  >
                    <option value="">-- Pilih Kota --</option>
                    {cities.length === 0 ? (
                      <option value="">Loading cities...</option>
                    ) : (
                      cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex flex-col items-center space-y-2 p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg cursor-pointer"
                  >
                    <img
                      src={candidate.img}
                      alt={candidate.name}
                      className="w-[200px] object-cover border-2 border-gray-300"
                    />
                    <p>{candidate.name}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={postResult}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
                disabled={hasVoted}
              >
                Kirim Pilihan
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-red-600">Alamak, belum login!</h1>
          <a href="/login" className="text-red-200 bg-red-500">PENCET TUK LOGIN</a>
        </div>
      )}
    </div>
  );
}