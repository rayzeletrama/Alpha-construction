import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { Loader2, ShieldCheck } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/v1/login", { email, password });
      localStorage.setItem("auth_token", data.token);
      navigate("/admin"); // Redirection vers le dashboard
    } catch (err: any) {
      setError("Identifiants invalides ou accès refusé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-4 rounded-sm shadow-xl shadow-primary/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Alpha Admin
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Authentification sécurisée requise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 text-sm font-bold border-l-4 border-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Email professionnel
            </label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm focus:border-primary outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-sm font-bold text-sm tracking-widest uppercase hover:bg-primary transition-all flex justify-center items-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
