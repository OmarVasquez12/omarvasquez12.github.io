import React, { useState } from 'react';
import { 
  Terminal, 
  X, 
  Check, 
  Copy, 
  Send, 
  ShieldCheck, 
  Code2, 
  Server, 
  KeyRound, 
  Play 
} from 'lucide-react';
import { LicenseValidationResponse } from '../types';

interface MtaApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MtaApiDocsModal: React.FC<MtaApiDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [testLicenseKey, setTestLicenseKey] = useState('XF-77A9-9B21-44EF');
  const [testProductId, setTestProductId] = useState('prod-1');
  const [testServerIp, setTestServerIp] = useState('185.220.101.45');
  const [testServerPort, setTestServerPort] = useState<number>(22003);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<LicenseValidationResponse | null>(null);
  const [copiedLua, setCopiedLua] = useState(false);

  const handleRunApiTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResponse(null);

    try {
      const res = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: testLicenseKey,
          product_id: testProductId,
          server_ip: testServerIp,
          server_port: testServerPort
        })
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : { valid: false, reason: 'EMPTY_RESPONSE' };
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({
        valid: false,
        reason: 'INVALID_REQUEST'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const luaScriptSnippet = `-- =========================================================
-- XF CODE - MTA REMOTE LICENSE VALIDATION SYSTEM
-- File: server.lua
-- Add to your MTA Resource server-side script
-- =========================================================

local LICENSE_KEY = "XF-YOUR-LICENSE-KEY-HERE"
local PRODUCT_ID = "${testProductId}"
local API_ENDPOINT = "https://ais-dev-7lmfx5jl5jmxmmja3ubf7x-448337454777.us-west1.run.app/api/license/validate"

function validateXfLicense()
    local serverIP = getServerIP() or "185.220.101.45"
    local serverPort = getServerPort() or 22003

    local postData = toJSON({
        license_key = LICENSE_KEY,
        product_id = PRODUCT_ID,
        server_ip = serverIP,
        server_port = serverPort
    })

    fetchRemote(API_ENDPOINT, {
        method = "POST",
        headers = { ["Content-Type"] = "application/json" },
        postData = postData
    }, function(responseData, errno)
        if errno == 0 then
            local result = fromJSON(responseData)
            if result and result.valid then
                outputServerLog("[XF CODE] Licencia valida! Iniciando resource: " .. tostring(result.product))
            else
                outputServerLog("[XF CODE ERROR] Licencia invalida: " .. tostring(result and result.reason or "UNKNOWN"))
                cancelEvent(true) -- Detiene la ejecucion del resource
            end
        else
            outputServerLog("[XF CODE ERROR] No se pudo conectar a la API de Licencias XF CODE.")
        end
    end)
end

addEventHandler("onResourceStart", resourceRoot, validateXfLicense)
`;

  const copyLuaToClipboard = () => {
    navigator.clipboard.writeText(luaScriptSnippet);
    setCopiedLua(true);
    setTimeout(() => setCopiedLua(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel p-6 sm:p-8 rounded-3xl border-[#8B5CF6]/40 bg-[#11111A] shadow-2xl my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0A0A0F] text-gray-400 hover:text-white border border-[#232336]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#232336]">
          <div className="p-3 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">API de Licencias Remota MTA:SA</h2>
            <p className="text-xs text-gray-400">Documentación de Integración Remote Validation & Probador Interactivo en Vivo.</p>
          </div>
        </div>

        {/* Live Interactive API Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-[#0A0A0F] p-5 rounded-2xl border border-[#232336]">
            <h3 className="text-xs font-bold text-purple-300 uppercase mb-3 flex items-center space-x-1.5">
              <Play className="w-4 h-4 text-[#8B5CF6]" />
              <span>Probador de API en Tiempo Real (POST)</span>
            </h3>

            <form onSubmit={handleRunApiTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">license_key</label>
                <input
                  type="text"
                  value={testLicenseKey}
                  onChange={(e) => setTestLicenseKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#11111A] border border-[#232336] text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">product_id</label>
                  <input
                    type="text"
                    value={testProductId}
                    onChange={(e) => setTestProductId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#11111A] border border-[#232336] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">server_port</label>
                  <input
                    type="number"
                    value={testServerPort}
                    onChange={(e) => setTestServerPort(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl bg-[#11111A] border border-[#232336] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">server_ip</label>
                <input
                  type="text"
                  value={testServerIp}
                  onChange={(e) => setTestServerIp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#11111A] border border-[#232336] text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isTesting}
                className="w-full py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{isTesting ? 'Probando API...' : 'Ejecutar Validación /api/license/validate'}</span>
              </button>
            </form>
          </div>

          {/* JSON Response View */}
          <div className="bg-[#0A0A0F] p-5 rounded-2xl border border-[#232336] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 font-mono">Respuesta JSON de la API:</h3>
              
              {testResponse ? (
                <pre className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
                  testResponse.valid 
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  {JSON.stringify(testResponse, null, 2)}
                </pre>
              ) : (
                <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-[#232336] rounded-xl font-mono">
                  Haz clic en "Ejecutar Validación" para simular la llamada del servidor MTA.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#232336] text-[11px] text-gray-400">
              Posibles razones de rechazo: <code className="text-purple-300">INVALID_LICENSE</code>, <code className="text-purple-300">IP_MISMATCH</code>, <code className="text-purple-300">PORT_MISMATCH</code>, <code className="text-purple-300">LICENSE_REVOKED</code>.
            </div>
          </div>

        </div>

        {/* Lua Code Snippet */}
        <div className="bg-[#0A0A0F] p-5 rounded-2xl border border-[#232336]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 font-mono">
              <Code2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>Código Lua para incorporar en tu Resource MTA (server.lua):</span>
            </h3>
            <button
              onClick={copyLuaToClipboard}
              className="px-3 py-1.5 rounded-lg bg-[#161622] hover:bg-[#232336] text-xs text-gray-300 font-bold border border-[#232336] flex items-center space-x-1 cursor-pointer"
            >
              {copiedLua ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLua ? '¡Copiado!' : 'Copiar Lua Script'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#07070A] border border-[#1A1A2A] text-xs font-mono text-purple-200 overflow-x-auto max-h-60 leading-relaxed">
            {luaScriptSnippet}
          </pre>
        </div>

      </div>
    </div>
  );
};
