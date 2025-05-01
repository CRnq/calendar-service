require 'firebase_id_token'
require 'net/http'
require 'json'
require 'openssl'

module FirebaseIdToken
  class Certificates
    CERT_URI = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

    def read_certificates
      fetch_certificates
    end

    def fetch_certificates
      uri = URI(CERT_URI)
      response = Net::HTTP.get(uri)
      data = JSON.parse(response)
      data.each_with_object({}) do |(kid, cert), acc|
        acc[kid] = OpenSSL::X509::Certificate.new(cert)
      end
    end
  end

  # Redisを使わない空のストア
  class RedisStore
    def initialize(_); end
    def [](_); nil; end
    def []=(_, _); end
  end
end