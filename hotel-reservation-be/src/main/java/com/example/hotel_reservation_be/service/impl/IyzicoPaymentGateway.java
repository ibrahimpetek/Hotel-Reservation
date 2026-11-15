package com.example.hotel_reservation_be.service.impl;

import java.util.ArrayList;
import java.util.List;


import com.example.hotel_reservation_be.dto.payment.GatewayChargeRequest;
import com.example.hotel_reservation_be.dto.payment.GatewayChargeResult;
import com.example.hotel_reservation_be.service.PaymentGateway;
import com.iyzipay.Options;
import com.iyzipay.model.Address;
import com.iyzipay.model.BasketItem;
import com.iyzipay.model.BasketItemType;
import com.iyzipay.model.Buyer;
import com.iyzipay.model.Currency;
import com.iyzipay.model.Locale;
import com.iyzipay.model.PaymentCard;
import com.iyzipay.model.PaymentChannel;
import com.iyzipay.model.PaymentGroup;
import com.iyzipay.request.CreatePaymentRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * iyzico SDK (com.iyzipay:iyzipay-java) uzerinden 3D Secure'suz (klasik)
 * odeme akisi. NOT: "com.iyzipay.model.Payment" ile bizim entity'miz
 * "com.ibrahim.hotel_be.entity.Payment" isim cakismasi yasadigi icin iyzico'nun
 * Payment sinifi burada TAM ISIM (fully-qualified) ile kullanilir.
 *
 * PRODUCTION ONERISI: Gercek bir otelde kart verisi dogrudan bu servise
 * gelmeden once 3D Secure akisina gecilmeli (CreateThreedsPaymentRequest).
 * Bu implementasyon, gelistirme/ogrenme amacli oldugu icin basitlestirilmis
 * (non-3DS) akisi kullanir.
 */

@Component
@RequiredArgsConstructor
public class IyzicoPaymentGateway implements PaymentGateway {

    private final Options iyzicoOptions;
    
@Override
    public GatewayChargeResult charge(GatewayChargeRequest req) {
        CreatePaymentRequest request = new CreatePaymentRequest();
        request.setLocale(Locale.TR.getValue());
        request.setConversationId(req.getConversationId());
        request.setPrice(req.getAmount());
        // Basitlik icin komisyon/vade farki yok -> paidPrice = price.
        request.setPaidPrice(req.getAmount());
        request.setCurrency(Currency.TRY.name());
        request.setInstallment(req.getInstallmentCount());
        request.setBasketId(req.getBasketItemId());
        request.setPaymentChannel(PaymentChannel.WEB.name());
        request.setPaymentGroup(PaymentGroup.PRODUCT.name());

        PaymentCard paymentCard = new PaymentCard();
        paymentCard.setCardHolderName(req.getCardHolderName());
        paymentCard.setCardNumber(req.getCardNumber());
        paymentCard.setExpireMonth(req.getExpireMonth());
        paymentCard.setExpireYear(req.getExpireYear());
        paymentCard.setCvc(req.getCvc());
        paymentCard.setRegisterCard(0);
        request.setPaymentCard(paymentCard);

        Buyer buyer = new Buyer();
        buyer.setId(req.getBasketItemId());
        buyer.setName(req.getBuyerFirstName());
        buyer.setSurname(req.getBuyerLastName());
        buyer.setGsmNumber(req.getBuyerPhone());
        buyer.setEmail(req.getBuyerEmail());
        // iyzico TCKN formatinda 11 hane bekler; misafir yabanciysa dummy deger kullanilir.
        buyer.setIdentityNumber(
                req.getBuyerIdentityNumber() != null && !req.getBuyerIdentityNumber().isBlank()
                        ? req.getBuyerIdentityNumber()
                        : "11111111111"
        );
        buyer.setIp("85.34.78.112"); // gercek projede request'ten alinan gercek IP kullanilmali
        buyer.setCity("Istanbul");
        buyer.setCountry("Turkey");
        buyer.setZipCode("34000");
        buyer.setRegistrationAddress("Otel rezervasyon musterisi");
        request.setBuyer(buyer);

        // Fiziksel urun tasima yok ama iyzico API'si zorunlu kildigi icin
        // otel adresi placeholder olarak kullanilir.
        Address address = new Address();
        address.setContactName(req.getBuyerFirstName() + " " + req.getBuyerLastName());
        address.setCity("Istanbul");
        address.setCountry("Turkey");
        address.setAddress("Otel rezervasyon adresi");
        address.setZipCode("34000");
        request.setShippingAddress(address);
        request.setBillingAddress(address);

        BasketItem basketItem = new BasketItem();
        basketItem.setId(req.getBasketItemId());
        basketItem.setName(req.getBasketItemName());
        basketItem.setCategory1("Konaklama");
        basketItem.setItemType(BasketItemType.VIRTUAL.name());
        basketItem.setPrice(req.getAmount());

        List<BasketItem> basketItems = new ArrayList<>();
        basketItems.add(basketItem);
        request.setBasketItems(basketItems);

        com.iyzipay.model.Payment iyzicoPayment = com.iyzipay.model.Payment.create(request, iyzicoOptions);

        boolean success = "success".equalsIgnoreCase(iyzicoPayment.getStatus());

        return GatewayChargeResult.builder()
                .success(success)
                .providerPaymentId(iyzicoPayment.getPaymentId())
                .providerConversationId(iyzicoPayment.getConversationId())
                .errorMessage(success ? null : iyzicoPayment.getErrorMessage())
                .threeDsHtmlContent(null)
                .build();
    }
}

