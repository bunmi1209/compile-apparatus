import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.6/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Compute Broker: Register Compute Resource",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const resourceDetails = {
            resourceType: types.ascii("GPU"),
            computationalPower: types.uint(1000000),
            pricePerUnit: types.uint(1000),
            endpoint: types.some(types.ascii("https://provider.com")),
            specialization: types.ascii("Machine Learning")
        };

        const block = chain.mineBlock([
            Tx.contractCall(
                'compute-broker', 
                'register-compute-resource', 
                [
                    resourceDetails.resourceType,
                    resourceDetails.computationalPower,
                    resourceDetails.pricePerUnit,
                    resourceDetails.endpoint,
                    resourceDetails.specialization
                ],
                deployer.address
            )
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk();
    }
});