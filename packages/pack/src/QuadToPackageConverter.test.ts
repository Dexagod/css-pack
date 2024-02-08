import "jest"

describe('A UmaClientImpl', () => {
  let umaClient: UmaClient;

  beforeEach(() => {
    umaClient = new UmaClientImpl({
      asUrl: MOCK_AS_URL,
      baseUrl: BASE_URL,
      maxTokenAge: 600,
      credentials: {
        ecAlgorithm: 'ES256',
        ecPrivateKey: MOCK_PRIVATE_KEY,
      },
    });
    (fetchUMAConfig as unknown as jest.Mock).mockImplementation(async () => MOCK_CONFIG);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the authorization service URL', () => {
    expect(umaClient.getAsUrl()).toBe(MOCK_AS_URL);
  });

  it('should return UMA Configuration for AS', async () => {
    expect(await umaClient.fetchUMAConfig()).toEqual(MOCK_CONFIG);
  });

  describe('when verifying a UMA Token', () => {
    it('should resolve the UMA token if valid', async () => {
      (verifyUMAToken as unknown as jest.Mock).mockImplementation(async () => MOCK_UMA_TOKEN);
      expect(await umaClient.verifyToken('abc')).toEqual(MOCK_UMA_TOKEN);
      expect(verifyUMAToken).toHaveBeenCalled();
      expect(verifyUMAToken).toHaveBeenCalledWith('abc', MOCK_CONFIG, {baseUrl: BASE_URL, maxTokenAge: 600});
    });
    it('should rethrow error if invalid', async () => {
      (verifyUMAToken as unknown as jest.Mock).mockImplementation(async () => {
        throw new Error('invalid');
      });
      await expect(async () => await umaClient.verifyToken('abc')).rejects
          .toThrowError('Error verifying UMA access token: invalid');
      expect(verifyUMAToken).toHaveBeenCalled();
      expect(verifyUMAToken).toHaveBeenCalledWith('abc', MOCK_CONFIG, {baseUrl: BASE_URL, maxTokenAge: 600});
    });
  });

  describe('when fetching a permission ticket', () => {
    it('should yield a valid ticket when the request was successful', async () =>{
      (fetchPermissionTicket as unknown as jest.Mock).mockImplementation(async () => 'abc');
      expect(await umaClient.fetchPermissionTicket({ticketSubject: MOCK_UMA_TOKEN.resource,
        owner: MOCK_UMA_TOKEN.webid,
        ticketNeeds: new Set(MOCK_UMA_TOKEN.modes)})).toEqual('abc');
      expect(fetchPermissionTicket).toHaveBeenCalled();
    });
    it('should return undefined when an error has occurred', async () =>{
      (fetchPermissionTicket as unknown as jest.Mock).mockImplementation(async () => {
        throw new Error('invalid');
      });
      expect(await umaClient.fetchPermissionTicket({ticketSubject: MOCK_UMA_TOKEN.resource,
        owner: MOCK_UMA_TOKEN.webid,
        ticketNeeds: new Set(MOCK_UMA_TOKEN.modes)})).toBeUndefined();
      expect(fetchPermissionTicket).toHaveBeenCalled();
    });
  });
});
